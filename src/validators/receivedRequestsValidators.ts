import { z } from "zod";
export const acceptJoinRequestValidator = z.object({
  requestId: z.string(),
});

export const cancelJoinRequestValidator = z.object({
  requestId: z.string(),
});

export const approveJoinRequestValidator = z.object({
  requestId: z.string(),
});

export const approveRemoveRequestValidator = z.object({
  requestId: z.string(),
});

export const cancelRemoveRequestValidator = z.object({ requestId: z.string() });
