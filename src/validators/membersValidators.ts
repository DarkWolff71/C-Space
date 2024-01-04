import { z } from "zod";

export const removeMemberRequestValidator = z.object({
  userEmail: z.string(),
});
