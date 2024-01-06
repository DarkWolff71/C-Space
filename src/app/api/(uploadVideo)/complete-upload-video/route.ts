import { completeUploadVideoRequestValidator } from "@/validators/uploadVideoValidators";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { getS3Instance } from "@/lib/helpers/s3Instance";
import _ from "lodash";

const s3 = getS3Instance();

export async function POST(req: NextRequest) {
  let validatedRequest = completeUploadVideoRequestValidator.safeParse(
    await req.json()
  );
  let session = await getServerSession(authOptions);

  if (
    !(
      validatedRequest.success === true &&
      session &&
      session.user.email &&
      session.user.roomName
    )
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  let multipartParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: validatedRequest.data.fileKey,
    UploadId: validatedRequest.data.uploadId,
    MultipartUpload: {
      // ordering the parts to make sure they are in the right order
      Parts: _.orderBy(validatedRequest.data.parts, ["PartNumber"], ["asc"]),
    },
  };
  const completeMultipartUploadOutput = await s3.completeMultipartUpload(
    multipartParams
  );

  return NextResponse.json({ message: "Successfully saved the video." });
}
