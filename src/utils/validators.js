const { z } = require("zod");
const { BadRequestError } = require("./errors");

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long"),
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const threadSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Content is required"),
});

const commentSchema = z.object({
  content: z.string().trim().min(1, "Content is required"),
});

const paginationSchema = z.object({
  limit: z.number().int().min(1).max(50).nullish().transform((value) => value ?? 10),
  cursor: z.string().trim().min(1).optional(),
});

const validate = (schema, data) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new BadRequestError(result.error.issues[0]?.message || "Invalid input");
  }

  return result.data;
};

module.exports = {
  registerSchema,
  loginSchema,
  threadSchema,
  commentSchema,
  paginationSchema,
  validate,
};
