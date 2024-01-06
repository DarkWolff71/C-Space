import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";

const prisma = getPrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!(session && session.user.roomName && session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbResponse = await prisma.room.findUnique({
    where: {
      name: session.user.roomName,
    },
    select: {
      owners: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ owners: dbResponse?.owners });
}
