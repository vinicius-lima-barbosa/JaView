import { z } from "zod";

export const userSchemaZod = z
  .object({
    name: z.string().min(1, "The name is required!"),
    email: z.string().email("Invalid email format!"),
    password: z
      .string()
      .min(6, "The password must have at leats 6 characters!"),
    confirmedPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "The password must be the same!",
  });
