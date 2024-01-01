import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";

const prisma = getPrismaClient();

export async function GET() {
  console.log("lineeeeeeeeeeeeeeeeee");
  const session = await getServerSession(authOptions);
  console.log("line 9 in rooms: ", session);

  if (!(session && session.user.roomName && session.user.email)) {
    console.log("line 11 in rooms: ");
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
  return NextResponse.json({ dbResponse });
}
