import { getServerSession } from "next-auth";
import { authOptions } from "../(authentication)/auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { createRoomRequestValidator } from "@/validators/roomsValidators";
import { getPrismaClient } from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {
  let prisma = getPrismaClient();

  let parsedRequest = createRoomRequestValidator.safeParse(await req.json());
  if (!parsedRequest.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  let reqBody = parsedRequest.data;
  let dbResult;

  dbResult = await prisma.room.findFirst({
    where: { name: reqBody.roomName },
  });

  if (dbResult) {
    return NextResponse.json({
      alreadyExists: "The room with the given name already exists",
    });
  }
  let session = await getServerSession(authOptions);
  if (session?.user?.email) {
    await prisma.room.create({
      data: {
        name: reqBody.roomName,
        owners: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });
  } else {
    return NextResponse.json(
      { errorMessage: "Session does not contain email address" },
      { status: 500 }
    );
  }

  //   session.user.roomName =

  //   let session = await getServerSession(authOptions);
  //   session.user.roomName =
  return res;
}
