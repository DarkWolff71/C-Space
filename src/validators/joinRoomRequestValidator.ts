import { z } from "zod";
export const joinRoomRequestValidator = z.object({
  fromUserId: z.string(),
  toUserId: z.string(),
  roomId: z.string(),
});
