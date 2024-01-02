import { authOptions } from "@/app/api/(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { cancelJoinRequestValidator } from "@/validators/receivedRequestsValidators";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  const validatedRequest = cancelJoinRequestValidator.safeParse(
    await req.json()
  );
  const session = await getServerSession(authOptions);
  if (!(validatedRequest.success === true && session && session.user.email)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const joinRequestDbResponse = await prisma.joinRequest.findUnique({
    where: {
      toUser: {
        email: session.user.email,
      },
      id: validatedRequest.data.requestId,
      isApprovedByOwners: true,
    },
    select: {
      fromRoom: {
        select: { name: true },
      },
      role: true,
    },
  });
  if (joinRequestDbResponse) {
    let updatedData;
    if (joinRequestDbResponse.role === Role.EDITOR) {
      updatedData = {
        editors: { connect: { email: session.user.email } },
      };
    } else {
      updatedData = {
        owners: { connect: { email: session.user.email } },
        editors: { disconnect: { email: session.user.email } },
      };
    }
    await prisma.room.update({
      where: {
        name: joinRequestDbResponse.fromRoom.name,
      },
      data: updatedData,
    });
    await prisma.room.delete({
      where: { id: validatedRequest.data.requestId },
    });
  }
  return NextResponse.json({});
}
