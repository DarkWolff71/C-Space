import { authOptions } from "@/app/api/(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!(session && session.user.email && session.user.roomName)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let verifyOwner = await prisma.room.findUnique({
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
        },
      },
    },
  });

  if (!(verifyOwner?._count.owners === 1)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  let dbResponse = await prisma.joinRequest.findMany({
    where: {
      AND: [
        {
          fromRoom: {
            name: session.user.roomName,
          },
        },
        { isApprovedByOwners: true },
      ],
    },
    select: {
      id: true,
      toUser: {
        select: {
          name: true,
          email: true,
        },
      },
      displayEditors: true,
      displayOwners: true,
      role: true,
    },
  });

  return NextResponse.json({ requests: dbResponse });
}
