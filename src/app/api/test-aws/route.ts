import { NextRequest, NextResponse } from "next/server";

import S3 from "aws-sdk/clients/s3";
import { randomUUID } from "crypto";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});

export async function GET(req: NextRequest) {
  console.log("line 15");
  const fileExtension = req.nextUrl.searchParams.get("fileType")?.split("/")[1];
  const key = `${randomUUID()}.${fileExtension}`;
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 3600,
    ContentType: `video/${fileExtension}`,
  };
  const uploadUrl = await s3.getSignedUrl("putObject", s3Params);
  console.log("line 24");
  return NextResponse.json({ uploadUrl, key });
}
