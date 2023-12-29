import { S3 } from "@aws-sdk/client-s3";

let s3Instance: S3 | undefined;

export function getS3Instance(): S3 {
  if (!s3Instance) {
    s3Instance = new S3({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    });
  }
  return s3Instance;
}
