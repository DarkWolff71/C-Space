import { authOptions } from "@/app/api/(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!(session && session.user.email)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const joinRequestsWithoutEditorsAndOnwersListPromise =
    prisma.joinRequest.findMany({
      where: {
        toUser: {
          email: session.user.email,
        },
        isApprovedByOwners: true,
        displayEditors: false,
        displayOwners: false,
      },
      select: {
        id: true,
        role: true,
        fromRoom: {
          select: {
            name: true,
          },
        },
      },
    });

  const joinRequestsWithEditorsListPromise = prisma.joinRequest.findMany({
    where: {
      toUser: {
        email: session.user.email,
      },
      isApprovedByOwners: true,
      displayEditors: true,
      displayOwners: false,
    },
    select: {
      id: true,
      role: true,
      fromRoom: {
        select: {
          name: true,
          editors: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const joinRequestsWithOwnersListPromise = prisma.joinRequest.findMany({
    where: {
      toUser: {
        email: session.user.email,
      },
      isApprovedByOwners: true,
      displayEditors: false,
      displayOwners: true,
    },
    select: {
      id: true,
      role: true,
      fromRoom: {
        select: {
          name: true,
          owners: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const joinRequestsWithOwnersAndEditorsListPromise =
    prisma.joinRequest.findMany({
      where: {
        toUser: {
          email: session.user.email,
        },
        isApprovedByOwners: true,
        displayEditors: true,
        displayOwners: true,
      },
      select: {
        id: true,
        role: true,
        fromRoom: {
          select: {
            name: true,
            owners: {
              select: {
                name: true,
                email: true,
              },
            },
            editors: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

  if (!session.user.roomName) {
    const [
      joinRequestsWithoutEditorsAndOnwersList,
      joinRequestsWithOwnersList,
      joinRequestsWithEditorsList,
      joinRequestsWithOwnersAndEditorsList,
    ] = await Promise.all([
      joinRequestsWithoutEditorsAndOnwersListPromise,
      joinRequestsWithOwnersListPromise,
      joinRequestsWithEditorsListPromise,
      joinRequestsWithOwnersAndEditorsListPromise,
    ]);

    return NextResponse.json({
      joinRequests: [
        ...joinRequestsWithoutEditorsAndOnwersList,
        ...joinRequestsWithOwnersList,
        ...joinRequestsWithEditorsList,
        ...joinRequestsWithOwnersAndEditorsList,
      ],
    });
  }

  let verifyOwnerPromise = prisma.room.findUnique({
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

  const [
    joinRequestsWithoutEditorsAndOnwersList,
    joinRequestsWithOwnersList,
    joinRequestsWithEditorsList,
    joinRequestsWithOwnersAndEditorsList,
    verifyOwner,
  ] = await Promise.all([
    joinRequestsWithoutEditorsAndOnwersListPromise,
    joinRequestsWithOwnersListPromise,
    joinRequestsWithEditorsListPromise,
    joinRequestsWithOwnersAndEditorsListPromise,
    verifyOwnerPromise,
  ]);

  if (!(verifyOwner?._count.owners === 1)) {
    return NextResponse.json({
      joinRequests: [
        ...joinRequestsWithoutEditorsAndOnwersList,
        ...joinRequestsWithOwnersList,
        ...joinRequestsWithEditorsList,
        ...joinRequestsWithOwnersAndEditorsList,
      ],
    });
  }

  const joinRoomApproveRequestsPromise = prisma.joinRequest.findMany({
    where: {
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
    select: {
      id: true,
      role: true,
      displayEditors: true,
      displayOwners: true,
      toUser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  const removeFromRoomApproveRequestsPromise = prisma.removeRequest.findMany({
    where: {
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
    select: {
      id: true,

      toUser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const [joinRoomApproveRequests, removeFromRoomApproveRequests] =
    await Promise.all([
      joinRoomApproveRequestsPromise,
      removeFromRoomApproveRequestsPromise,
    ]);

  return NextResponse.json({
    joinRequests: [
      ...joinRequestsWithoutEditorsAndOnwersList,
      ...joinRequestsWithOwnersList,
      ...joinRequestsWithEditorsList,
      ...joinRequestsWithOwnersAndEditorsList,
    ],
    joinRoomApproveRequests,
    removeFromRoomApproveRequests,
  });
}
