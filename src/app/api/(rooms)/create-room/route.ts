import { getServerSession } from "next-auth";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { createRoomRequestValidator } from "@/validators/roomsValidators";
import { getPrismaClient } from "@/lib/helpers/prisma";

const prisma = getPrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  let parsedRequest = createRoomRequestValidator.safeParse(await req.json());
  if (!parsedRequest.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  let reqBody = parsedRequest.data;

  let dbResult = await prisma.room.findFirst({
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

  return NextResponse.json({});
}
