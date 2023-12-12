import { z } from "zod";
export const joinRoomRequestValidator = z.object({
  fromUserId: z.string(),
  to: z.string(),
  roomId: z.string(),
});
