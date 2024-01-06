import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";

let prisma = getPrismaClient();

export async function DELETE(req: NextRequest) {
  let roomNameQueryParam = req.nextUrl.searchParams.get("roomName");
  let session = await getServerSession(authOptions);

  if (!(roomNameQueryParam && session && session.user.email)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let dbResult = await prisma.room.findUnique({
    where: {
      name: roomNameQueryParam,
    },
    select: {
      _count: {
        select: {
          owners: true,
        },
      },
      owners: {
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!dbResult || dbResult?._count.owners > 1 || dbResult.owners.length != 1) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await prisma.room.delete({
    where: {
      name: roomNameQueryParam,
    },
  });

  return NextResponse.json({ message: "Succedfully deleted the room." });
}
