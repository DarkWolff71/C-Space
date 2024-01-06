import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";

let prisma = getPrismaClient();

export async function GET(req: NextRequest) {
  let session = await getServerSession(authOptions);
  if (!session || !session.user.roomName) {
    return NextResponse.json(
      { Error: "Unauthorized request" },
      { status: 401 }
    );
  }
  try {
    let dbResult = await prisma.room.findUnique({
      where: { name: session.user.roomName },
      select: {
        editors: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        owners: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ ...dbResult });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
