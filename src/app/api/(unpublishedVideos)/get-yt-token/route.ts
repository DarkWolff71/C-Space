import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { oAuthYoutubeUrl } from "@/lib/helpers/oAuthForYoutubeUpload";

const prisma = getPrismaClient();

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

  if (dbResponse?._count.owners !== 1) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  return NextResponse.json({ url: oAuthYoutubeUrl });
}
