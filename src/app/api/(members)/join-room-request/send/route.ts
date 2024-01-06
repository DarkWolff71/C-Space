import { NextRequest, NextResponse } from "next/server";
import { joinRoomRequestValidator } from "@/validators/joinRoomRequestValidator";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { authOptions } from "../../../(authentication)/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";

let prisma = getPrismaClient();

async function isMemberAlreadyAdded(
  roomName: string,
  userEmail: string,
  role: Role
) {
  let selectQuery;
  if (role === Role.EDITOR) {
    selectQuery = {
      editors: {
        where: {
          email: userEmail,
        },
      },
    };
  } else {
    selectQuery = {
      owners: {
        where: {
          email: userEmail,
        },
      },
    };
  }
  let dbResponse = await prisma.room.findUnique({
    where: {
      name: roomName,
    },
    select: {
      _count: {
        select: selectQuery,
      },
    },
  });
  if (
    //@ts-ignore
    (dbResponse?._count.owners ?? 0) + (dbResponse?._count.editors ?? 0) ===
    1
  ) {
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  let parsedRequest = joinRoomRequestValidator.safeParse(await req.json());
  let session = await getServerSession(authOptions);

  if (
    !(parsedRequest.success && session?.user.email && session.user.roomName)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  let { toUserEmail, role, displayOwners, displayEditors } = parsedRequest.data;

  let validateOwnerPromise = prisma.room.findUnique({
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

  let ownersCountPromise = prisma.room.findUnique({
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

  let [validateOwner, ownersCount] = await Promise.all([
    validateOwnerPromise,
    ownersCountPromise,
  ]);

  if (
    await isMemberAlreadyAdded(
      session.user.roomName,
      toUserEmail,
      role === "editor" ? Role.EDITOR : Role.OWNER
    )
  ) {
    return NextResponse.json(
      { error: "User is already added." },
      { status: 400 }
    );
  }
  if (
    !((validateOwner?._count.owners ?? 0) === 1 && ownersCount?._count.owners)
  ) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  if (ownersCount._count.owners > 1) {
    await prisma.joinRequest.create({
      data: {
        role: role === "editor" ? Role.EDITOR : Role.OWNER,
        isApprovedByOwners: false,
        fromRoom: { connect: { name: session.user.roomName } },
        toUser: { connect: { email: toUserEmail } },
        approvedByOwners: { connect: { email: session.user.email } },
        displayEditors: displayEditors,
        displayOwners: displayOwners,
      },
    });
  } else {
    await prisma.joinRequest.create({
      data: {
        role: role === "editor" ? Role.EDITOR : Role.OWNER,
        isApprovedByOwners: true,
        fromRoom: { connect: { name: session.user.roomName } },
        toUser: { connect: { email: toUserEmail } },
        approvedByOwners: { connect: { email: session.user.email } },
        displayEditors: displayEditors,
        displayOwners: displayOwners,
      },
    });
  }

  return NextResponse.json({
    message: "Successfully created the join request.",
  });
}
