import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { sendVideoForApprovalRequestValidator } from "@/validators/unpublishedVideosValidator";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  const validatedRequest = sendVideoForApprovalRequestValidator.safeParse(
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
          editors: {
            where: {
              email: session.user.email,
            },
          },
          unpublishedVideos: {
            where: {
              id: validatedRequest.data.videoId,
            },
          },
        },
      },
    },
  });

  if (
    !(
      (verifyWithDb?._count.editors ?? 0) +
        (verifyWithDb?._count.owners ?? 0) ===
        1 && verifyWithDb?._count.unpublishedVideos === 1
    )
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.video.update({
    where: {
      id: validatedRequest.data.videoId,
    },
    data: {
      sentForApproval: true,
    },
  });

  return NextResponse.json({ message: "Success" });
}
