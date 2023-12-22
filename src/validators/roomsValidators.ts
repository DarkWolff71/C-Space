import { z } from "zod";

const noLeadingTrailingSpaces = (value: string) =>
  !value.startsWith(" ") && !value.endsWith(" ");

const noConsecutiveSpaces = (value: string) => !/\s\s/.test(value);

export const roomNameValidator = z
  .string()
  .min(1, {
    message: "String should not be empty.",
  })
  .refine(noLeadingTrailingSpaces, {
    message: "Name should not have leading or trailing spaces.",
  })
  .refine(noConsecutiveSpaces, {
    message: "Name should not have consecutive spaces.",
  });

export const createRoomRequestValidator = z.object({
  roomName: roomNameValidator,
});

export const leaveRoomRequestValidator = z.object({ roomName: z.string() });
