import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";

const prisma = getPrismaClient();

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

  let usersInDifferentRoomsAndRequestHasNotBeenSentPromise =
    prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { email: { startsWith: requestInput } },
              { userName: { startsWith: requestInput } },
            ],
          },
          {
            NOT: {
              receivedRequests: {
                some: {
                  fromRoom: {
                    name: session?.user.roomName,
                  },
                },
              },
            },
          },
        ],
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

  let usersInDifferentRoomsAndRequestHasBeenSentPromise = prisma.user.findMany({
    where: {
      AND: [
        {
          OR: [
            { email: { startsWith: requestInput } },
            { userName: { startsWith: requestInput } },
          ],
        },
        {
          receivedRequests: {
            some: {
              fromRoom: {
                name: session?.user.roomName,
              },
            },
          },
        },
      ],
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

  let ownersInSameRoomPromise = prisma.room.findUnique({
    where: { name: session.user.roomName },

    select: {
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

  let editorsInSameRoomAndRequestHasNotBeenSentPromise = prisma.room.findUnique(
    {
      where: { name: session.user.roomName },

      select: {
        editors: {
          where: {
            AND: [
              {
                OR: [
                  { email: { startsWith: requestInput } },
                  { userName: { startsWith: requestInput } },
                ],
              },
              {
                NOT: {
                  receivedRequests: {
                    some: {
                      fromRoom: {
                        name: session?.user.roomName,
                      },
                    },
                  },
                },
              },
            ],
          },
          select: {
            email: true,
            name: true,
            image: true,
          },
        },
      },
    }
  );

  let editorsInSameRoomAndRequestHasBeenSentPromise = prisma.room.findUnique({
    where: { name: session.user.roomName },

    select: {
      editors: {
        where: {
          AND: [
            {
              OR: [
                { email: { startsWith: requestInput } },
                { userName: { startsWith: requestInput } },
              ],
            },
            {
              receivedRequests: {
                some: {
                  fromRoom: {
                    name: session?.user.roomName,
                  },
                },
              },
            },
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
    let [
      usersInDifferentRoomsAndRequestHasNotBeenSent,
      usersInDifferentRoomsAndRequestHasBeenSent,
      ownersInSameRoom,
      editorsInSameRoomAndRequestHasNotBeenSent,
      editorsInSameRoomAndRequestHasBeenSent,
    ] = await Promise.all([
      usersInDifferentRoomsAndRequestHasNotBeenSentPromise,
      usersInDifferentRoomsAndRequestHasBeenSentPromise,
      ownersInSameRoomPromise,
      editorsInSameRoomAndRequestHasNotBeenSentPromise,
      editorsInSameRoomAndRequestHasBeenSentPromise,
    ]);

    return NextResponse.json({
      usersInDifferentRoomsAndRequestHasBeenSent,
      usersInDifferentRoomsAndRequestHasNotBeenSent,
      ownersInSameRoom: ownersInSameRoom?.owners,
      editorsInSameRoomAndRequestHasBeenSent:
        editorsInSameRoomAndRequestHasBeenSent?.editors,
      editorsInSameRoomAndRequestHasNotBeenSent:
        editorsInSameRoomAndRequestHasNotBeenSent?.editors,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
