import { authOptions } from "@/app/api/(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { cancelJoinRequestValidator } from "@/validators/receivedRequestsValidators";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  const validatedRequest = cancelJoinRequestValidator.safeParse(
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

  await prisma.joinRequest.delete({
    where: {
      OR: [
        {
          toUser: {
            email: session.user.email,
          },
        },
        {
          fromRoom: {
            AND: [
              {
                owners: {
                  some: {
                    email: session.user.email,
                  },
                },
              },
              { name: session.user.roomName },
            ],
          },
        },
      ],
      id: validatedRequest.data.requestId,
    },
  });
  return NextResponse.json({});
}
