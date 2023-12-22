import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { leaveRoomRequestValidator } from "@/validators/roomsValidators";
import { getPrismaClient } from "@/lib/prisma";

let prisma = getPrismaClient();

export async function PUT(req: NextRequest) {
  let requestBody = await req.json();
  let parsedRequestBody = leaveRoomRequestValidator.safeParse(requestBody);
  let session = await getServerSession(authOptions);
  if (!(parsedRequestBody.success && session && session.user.email)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  let dbResult = await prisma.room.findUnique({
    where: {
      name: parsedRequestBody.data.roomName,
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
        },
      },
    },
  });

  if (!(dbResult && dbResult._count.editors + dbResult._count.owners == 1)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  await prisma.room.update({
    where: {
      name: parsedRequestBody.data.roomName,
    },
    data: {
      owners: {
        disconnect: {
          email: session.user.email,
        },
      },
      editors: {
        disconnect: {
          email: session.user.email,
        },
      },
    },
  });

  return NextResponse.json({ message: "Successfully removed from the room." });
}
