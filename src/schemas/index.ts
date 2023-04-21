import { object, z } from "zod";

export const postSchema = object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  admin: z.boolean().optional().default(false),
  active: z.boolean().default(true),
});

export const updateSchema = object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  admin: z.boolean().optional().default(false),
  active: z.boolean().optional(),
});

export function formatErrors(errors: any) {
  const result: { [key: string]: string[] } = {};
  for (const error of errors) {
    const field = error.path[0];
    const message = error.message;
    if (!result[field]) {
      result[field] = [];
    }
    result[field].push(message);
  }
  return result;
}

export const loginSchema = object({
  email: z.string(),
  password: z.string(),
});
