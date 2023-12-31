import { z } from "zod";
export const joinRoomRequestValidator = z.object({
  toUserEmail: z.string(),
  role: z.enum(["editor", "owner"]),
  displayOwners: z.boolean(),
  displayEditors: z.boolean(),
});
