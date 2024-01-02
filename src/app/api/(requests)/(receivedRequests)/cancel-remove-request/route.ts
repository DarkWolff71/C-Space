import { authOptions } from "@/app/api/(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { cancelRemoveRequestValidator } from "@/validators/receivedRequestsValidators";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  const validatedRequest = cancelRemoveRequestValidator.safeParse(
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
  const verifyOwner = await prisma.room.findUnique({
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
  if (!verifyOwner || verifyOwner._count.owners !== 1) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  await prisma.removeRequest.delete({
    where: {
      id: validatedRequest.data.requestId,
      fromRoom: {
        name: session.user.roomName,
      },
    },
  });
  return NextResponse.json({});
}
