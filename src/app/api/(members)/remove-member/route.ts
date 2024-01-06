import { authOptions } from "@/app/api/(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { removeMemberRequestValidator } from "@/validators/membersValidators";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

let prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  let validatedRequest = removeMemberRequestValidator.safeParse(
    await req.json()
  );
  let session = await getServerSession(authOptions);

  if (
    !(
      validatedRequest.success &&
      session &&
      session.user.email &&
      session.user.roomName
    )
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const requestAlreadyPresent = await prisma.removeRequest.findMany({
    where: {
      fromRoom: {
        name: session.user.roomName,
      },
      toUser: {
        email: validatedRequest.data.userEmail,
      },
    },
    select: {
      id: true,
    },
  });

  if (requestAlreadyPresent.length > 0) {
    return NextResponse.json({ message: "Request already present." });
  }

  let userExists = await prisma.room.findUnique({
    where: {
      name: session.user.roomName,
    },
    select: {
      _count: {
        select: {
          editors: {
            where: {
              email: validatedRequest.data.userEmail,
            },
          },
          owners: {
            where: {
              email: validatedRequest.data.userEmail,
            },
          },
        },
      },
    },
  });

  if (
    !(userExists && userExists._count.editors + userExists._count.owners === 1)
  ) {
    return NextResponse.json(
      { error: "Invalid request. The user does not exist in your room." },
      { status: 400 }
    );
  }

  let ownersCount = await prisma.room.findUnique({
    where: {
      name: session.user.roomName,
    },
    select: {
      _count: {
        select: {
          owners: true,
        },
      },
    },
  });

  if (!(!!ownersCount && !!ownersCount._count.owners)) {
    return NextResponse.json({}, { status: 500 });
  }

  let successMessage = "";
  if (userExists._count.editors === 1) {
    if (ownersCount._count.owners > 1) {
      await prisma.removeRequest.create({
        data: {
          toUser: {
            connect: {
              email: validatedRequest.data.userEmail,
            },
          },
          fromRoom: {
            connect: {
              name: session.user.roomName,
            },
          },
          approvedByOwners: {
            connect: {
              email: session.user.email,
            },
          },
        },
      });
      successMessage = "created request";
    } else {
      await prisma.room.update({
        where: {
          name: session.user.roomName,
        },
        data: {
          editors: {
            disconnect: { email: validatedRequest.data.userEmail },
          },
        },
      });
      successMessage = "success";
    }
  } else {
    if (!(ownersCount._count.owners > 1)) {
      return NextResponse.json({
        error: "Invalid request. Try deleting the room.",
      });
    } else {
      await prisma.removeRequest.create({
        data: {
          toUser: {
            connect: {
              email: validatedRequest.data.userEmail,
            },
          },
          fromRoom: {
            connect: {
              name: session.user.roomName,
            },
          },
          approvedByOwners: {
            connect: {
              email: session.user.email,
            },
          },
        },
      });
      successMessage = "created request";
    }
  }

  return NextResponse.json({ message: successMessage });
}
