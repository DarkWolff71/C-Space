import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";

const prisma = getPrismaClient();

export async function GET() {
  console.log("line 9");
  console.log(authOptions);
  const session = await getServerSession(authOptions);
  console.log("session: ", session);
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
          thumbnailUrl: true,
          privacyStatus: true,
          isEditable: true,
          isApproved: true,
          videoFileSize: true,
          videoType: true,
          sentForApproval: true,
          // to check if the video is approved by the user
          approvedByOwners: {
            select: {
              name: true,
              email: true,
            },
          },
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

  return NextResponse.json({
    videos: dbResponse?.unpublishedVideos,
  });
}
