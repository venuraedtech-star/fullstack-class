const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const SAFE_USER_SELECT = { id: true, email: true, name: true, role: true, createdAt: true };
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Used only to give bcrypt.compare something to hash-and-compare against
// when no user is found, so a login attempt against a nonexistent email
// takes the same amount of time as a wrong password for a real one —
// otherwise response timing itself would reveal whether an email is
// registered, defeating the point of the shared "Invalid email or
// password" message below.
const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8u1e4XcgOEJKmb5m4V4jYm5jJ2y1Iq";

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
}

async function generateRefreshToken(user) {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  await prisma.refreshToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return token;
}

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: SAFE_USER_SELECT,
    });

    const accessToken = signToken(user);
    const refreshToken = await generateRefreshToken(user);
    res.status(201).json({ accessToken, refreshToken, user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    const passwordMatches = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    if (!user || !passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { password: _password, ...safeUser } = user;
    const accessToken = signToken(safeUser);
    const refreshToken = await generateRefreshToken(safeUser);
    res.status(200).json({ accessToken, refreshToken, user: safeUser });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: SAFE_USER_SELECT,
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const accessToken = signToken(user);
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout };
