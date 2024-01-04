import { z } from "zod";

export const approveVideoRequestValidator = z.object({
  videoId: z.string(),
});

export const sendVideoForApprovalRequestValidator = z.object({
  videoId: z.string(),
});

export const publishVideoRequestValidator = z.object({
  videoId: z.string(),
  ytToken: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

export const videoEditableRequestValidator = z.object({
  videoId: z.string(),
});
