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

// sameSite: "none" is required for the cookie to be sent on cross-site
// requests (the deployed frontend and API live on different domains —
// e.g. vercel.app and onrender.com) but browsers only honor "none" when
// paired with secure: true, so it falls back to "lax" for local dev over
// plain http where secure cookies don't work at all.
function refreshCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
}

function setRefreshTokenCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    ...refreshCookieOptions(),
    maxAge: REFRESH_TOKEN_TTL_MS,
  });
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
    setRefreshTokenCookie(res, refreshToken);
    res.status(201).json({ accessToken, user });
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
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({ accessToken, user: safeUser });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

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
    const { refreshToken } = req.cookies;
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    res.clearCookie("refreshToken", refreshCookieOptions());
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout };
