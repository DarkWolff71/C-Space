import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../(authentication)/auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  let session = await getServerSession(authOptions);
  if (!(session && session.user.name && session.user.roomName))
    return NextResponse.json(
      { error: "Unauthorised request." },
      { status: 401 }
    );
  let requestInput = req.nextUrl.searchParams.get("searchInput");
  if (!requestInput) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }
  let prisma = getPrismaClient();

  let userEmail = session?.user.email;

  let usersInDifferentRoomsPromise = prisma.user.findMany({
    where: {
      OR: [
        { email: { startsWith: requestInput } },
        { userName: { startsWith: requestInput } },
      ],
      NOT: [
        {
          ownerRooms: {
            some: {
              name: session.user.roomName,
            },
          },
        },
        {
          editorRooms: {
            some: {
              name: session.user.roomName,
            },
          },
        },
      ],
    },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  let usersInSameRoomPromise = prisma.room.findUnique({
    where: { name: session.user.roomName },

    include: {
      editors: {
        where: {
          OR: [
            { email: { startsWith: requestInput } },
            { userName: { startsWith: requestInput } },
          ],
        },
        select: {
          email: true,
          name: true,
          image: true,
        },
      },
      owners: {
        where: {
          OR: [
            { email: { startsWith: requestInput } },
            { userName: { startsWith: requestInput } },
          ],
        },
        select: {
          email: true,
          name: true,
          image: true,
        },
      },
    },
  });

  try {
    let [usersInDifferentRooms, usersInSameRoom] = await Promise.all([
      usersInDifferentRoomsPromise,
      usersInSameRoomPromise,
    ]);

    return NextResponse.json({
      usersInDifferentRooms,
      usersInSameRoom: {
        editors: usersInSameRoom?.editors,
        owners: usersInSameRoom?.owners,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
