const { z } = require("zod");

const commentSchema = z.object({
  authorName: z.string().trim().min(1, "authorName is required"),
  text: z.string().trim().min(1, "text is required").max(500, "text must be 500 characters or fewer"),
});

function validateComment(req, res, next) {
  const result = commentSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  req.body = result.data;
  next();
}

module.exports = validateComment;
