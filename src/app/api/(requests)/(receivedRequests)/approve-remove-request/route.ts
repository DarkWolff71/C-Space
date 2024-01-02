import { authOptions } from "@/app/api/(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { approveRemoveRequestValidator } from "@/validators/receivedRequestsValidators";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  const validatedRequest = approveRemoveRequestValidator.safeParse(
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
  const updateDbResponse = await prisma.removeRequest.update({
    where: {
      id: validatedRequest.data.requestId,
      fromRoom: {
        name: session.user.roomName,
      },
      isApprovedByOwners: false,
      approvedByOwners: {
        none: {
          email: session.user.email,
        },
      },
    },
    data: {
      approvedByOwners: {
        connect: {
          email: session.user.email,
        },
      },
    },
    select: {
      _count: {
        select: {
          approvedByOwners: true,
        },
      },
      fromRoom: {
        select: {
          _count: {
            select: {
              owners: true,
            },
          },
        },
      },
    },
  });
  if (
    updateDbResponse._count.approvedByOwners ===
    updateDbResponse.fromRoom._count.owners
  ) {
    await prisma.room.update({
      where: {
        name: session.user.roomName,
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
    await prisma.removeRequest.delete({
      where: {
        id: validatedRequest.data.requestId,
      },
    });
  }
  return NextResponse.json({ message: "Success" });
}
