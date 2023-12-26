import S3 from "aws-sdk/clients/s3";

let s3Instance: S3 | undefined;

export function getS3Instance(): S3 {
  if (!s3Instance) {
    s3Instance = new S3({
      apiVersion: "2006-03-01",
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: "v4",
    });
  }
  return s3Instance;
}
