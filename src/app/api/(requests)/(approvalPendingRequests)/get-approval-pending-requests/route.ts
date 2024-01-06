import { authOptions } from "@/app/api/(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!(session && session.user.email && session.user.roomName)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const approvalPendingJoinRequestsPromise = prisma.joinRequest.findMany({
    where: {
      fromRoom: {
        name: session.user.roomName,
      },
      isApprovedByOwners: false,
      approvedByOwners: {
        some: {
          email: session.user.email,
        },
      },
    },
    select: {
      id: true,
      displayEditors: true,
      displayOwners: true,
      role: true,
      toUser: {
        select: {
          name: true,
          email: true,
        },
      },
      approvedByOwners: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const approvalPendingRemoveRequestsPromise = prisma.removeRequest.findMany({
    where: {
      fromRoom: {
        name: session.user.roomName,
      },
      isApprovedByOwners: false,
      approvedByOwners: {
        some: {
          email: session.user.email,
        },
      },
    },
    select: {
      id: true,
      approvedByOwners: {
        select: {
          name: true,
          email: true,
        },
      },
      toUser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  let [approvalPendingJoinRequests, approvalPendingRemoveRequests] =
    await Promise.all([
      approvalPendingJoinRequestsPromise,
      approvalPendingRemoveRequestsPromise,
    ]);

  return NextResponse.json({
    approvalPendingJoinRequests,
    approvalPendingRemoveRequests,
  });
}
