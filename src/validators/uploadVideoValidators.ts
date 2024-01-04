import { z } from "zod";

export const createUploadVideoRequestValidator = z
  .object({
    title: z.optional(z.string()),
    description: z.optional(z.string()),
    tags: z.optional(z.array(z.string())),
    privacyStatus: z.optional(z.enum(["private", "public", "unlisted"])),
    videoId: z.optional(z.string()),
    categoryId: z.optional(z.string()),
    videoFileChanged: z.boolean(),
    videoFile: z.optional(
      z.object({ name: z.string(), size: z.number(), type: z.string() })
    ),
    thumbnailFileChanged: z.boolean(),
    thumbnailFile: z.optional(
      z.object({ name: z.string(), size: z.number(), type: z.string() })
    ),
  })
  .strict();

export type CreateUploadVideoRequestBodyType = z.infer<
  typeof createUploadVideoRequestValidator
>;

export const completeUploadVideoRequestValidator = z
  .object({
    uploadId: z.string(),
    fileKey: z.string(),
    parts: z.array(
      z.object({
        PartNumber: z.number(),
        ETag: z.string(),
      })
    ),
  })
  .strict();
