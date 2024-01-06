import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Instance } from "@/lib/helpers/s3Instance";

const prisma = getPrismaClient();
const s3 = getS3Instance();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!(session && session.user.email && session.user.roomName)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let dbResponse = await prisma.room.findUnique({
    where: {
      name: session.user.roomName,
    },
    select: {
      unpublishedVideos: {
        select: {
          id: true,
          title: true,
          description: true,
          tags: true,
          categoryId: true,
          privacyStatus: true,
          isEditable: true,
          isApproved: true,
          videoFileSize: true,
          videoType: true,
          videoFileName: true,
          thumbnailSize: true,
          thumbnailS3Key: true,
          thumbnailType: true,
          sentForApproval: true,
          approvedByOwners: {
            select: {
              name: true,
              email: true,
            },
          },
          // to check if the video is approved by the user
          _count: {
            select: {
              approvedByOwners: {
                where: {
                  email: session.user.email,
                },
              },
            },
          },
        },
      },
    },
  });

  const unpublishedVideos = await Promise.all(
    (dbResponse?.unpublishedVideos || [])
      .map(async (video) => {
        if (video.thumbnailS3Key) {
          const getObjectCommand = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: video.thumbnailS3Key,
          });
          const url = await getSignedUrl(s3, getObjectCommand, {
            expiresIn: 60 * 60 * 16,
          });

          return { ...video, thumbnailUrl: url };
        }

        return video;
      })
      .filter(Boolean) // Filter out undefined values
  );

  return NextResponse.json({
    videos: unpublishedVideos,
  });
}
