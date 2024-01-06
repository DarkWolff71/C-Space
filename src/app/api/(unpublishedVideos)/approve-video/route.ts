import { getPrismaClient } from "@/lib/helpers/prisma";
import { approveVideoRequestValidator } from "@/validators/unpublishedVideosValidator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  const validatedRequest = approveVideoRequestValidator.safeParse(
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
              id: validatedRequest.data.videoId,
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

  const approvedOwnersCountPromise = prisma.video.update({
    where: {
      id: validatedRequest.data.videoId,
    },
    data: {
      approvedByOwners: {
        connect: {
          email: session.user.email,
        },
      },
    },
    select: {
      _count: {
        select: {
          approvedByOwners: true,
        },
      },
    },
  });

  const ownersCountPromise = prisma.room.findUnique({
    where: {
      name: session.user.roomName,
    },
    select: {
      _count: {
        select: {
          owners: true,
        },
      },
    },
  });

  const [ownersCount, approvedOwnersCount] = await Promise.all([
    ownersCountPromise,
    approvedOwnersCountPromise,
  ]);

  if (
    ownersCount?._count.owners === approvedOwnersCount._count.approvedByOwners
  ) {
    await prisma.video.update({
      where: {
        id: validatedRequest.data.videoId,
      },
      data: {
        isApproved: true,
      },
    });
  }

  return NextResponse.json({ message: "Success" });
}
