import { z } from "zod";
export const signupRequestValidator = z.object({
  name: z.string(),
  userName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});
export type SignupRequestType = z.infer<typeof signupRequestValidator>;
