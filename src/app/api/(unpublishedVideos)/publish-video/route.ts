import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { publishVideoRequestValidator } from "@/validators/unpublishedVideosValidator";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { oAuth2Client } from "@/lib/helpers/oAuthForYoutubeUpload";
import { getS3Instance } from "@/lib/helpers/s3Instance";
import { google, youtube_v3 } from "googleapis";
import { getVideoPrivacuStatusString } from "@/lib/helpers/videoPrivacyStatus";

const prisma = getPrismaClient();
const s3 = getS3Instance();

export async function POST(req: NextRequest) {
  const validatedRequest = publishVideoRequestValidator.safeParse(
    await req.json()
  );
  const session = await getServerSession(authOptions);

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

  const verifyWithDb = await prisma.room.findUnique({
    where: {
      name: session.user.roomName,
    },
    select: {
      _count: {
        select: {
          owners: {
            where: {
              email: session.user.email,
            },
          },
          unpublishedVideos: {
            where: {
              AND: [
                {
                  id: validatedRequest.data.videoId,
                },
                {
                  isApproved: true,
                  isEditable: true,
                },
              ],
            },
          },
        },
      },
    },
  });

  if (
    !(
      verifyWithDb?._count.owners === 1 &&
      verifyWithDb?._count.unpublishedVideos === 1
    )
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.video.update({
    where: { id: validatedRequest.data.videoId },
    data: {
      isEditable: false,
    },
  });
  const video = await prisma.video.findUnique({
    where: { id: validatedRequest.data.videoId },
    select: {
      videoS3Key: true,
      thumbnailS3Key: true,
      title: true,
      description: true,
      categoryId: true,
      tags: true,
      privacyStatus: true,
    },
  });
  oAuth2Client.setCredentials({
    access_token: validatedRequest.data.ytToken.accessToken,
    refresh_token: validatedRequest.data.ytToken.refreshToken,
  });

  const youtube = google.youtube({ version: "v3", auth: oAuth2Client });
  const videoMetadata: youtube_v3.Schema$Video = {
    snippet: {
      title: video?.title,
      description: video?.description,
      tags: video?.tags,
      categoryId: video?.categoryId,
    },
    status: {
      privacyStatus: getVideoPrivacuStatusString(video?.privacyStatus),
    },
  };
  let videoId = "";
  if (video?.videoS3Key) {
    let s3Object = await s3.getObject({
      Key: video.videoS3Key,
      Bucket: process.env.AWS_BUCKET_NAME,
    });
    let fileStream = s3Object.Body;
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: videoMetadata,
      media: {
        body: fileStream,
      },
    });
    //if you want to delete the video from s3 after publishing it to youtube
    s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: video.videoS3Key,
    });
    videoId = response.data.id ?? "";
  } else {
    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: videoMetadata,
    });
    videoId = response.data.id ?? "";
  }

  if (video?.thumbnailS3Key) {
    let s3Object = await s3.getObject({
      Key: video.thumbnailS3Key,
      Bucket: process.env.AWS_BUCKET_NAME,
    });
    let fileStream = s3Object.Body;
    if (videoId) {
      await youtube.thumbnails.set({
        videoId: videoId,
        media: {
          body: fileStream,
        },
      });
    }

    //if you want to delete the thumbnail from s3 after publishing it to youtube
    s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: video.thumbnailS3Key,
    });
  }

  //if you want to delete the video from db after publishing it to youtube
  await prisma.video.delete({
    where: {
      id: validatedRequest.data.videoId,
    },
  });

  return NextResponse.json({ message: "Successfull uploaded to Youtube." });
}
