import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  console.log("I'm in route");
  console.log(req.cookies.getAll());
  let prisma = getPrismaClient();
  let session = await getServerSession(authOptions);
  console.log("session: ", session);
  console.log("I'm in route-------------");
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  if (!session.user?.email) {
    return NextResponse.json(
      { error: "Unauthorised. Session does not contain email address" },
      { status: 401 }
    );
  }

  try {
    const dbResult = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        editorRooms: {
          select: {
            _count: {
              select: {
                editors: true,
                owners: true,
                unpublishedVideos: true,
                joinRequests: {
                  where: {
                    //received join requests
                    AND: [
                      { toUser: { email: session.user.email } },
                      { isApprovedByOwners: true },
                    ],
                  },
                },
              },
            },
            name: true,
          },
        },
        ownerRooms: {
          select: {
            _count: {
              select: {
                editors: true,
                owners: true,
                unpublishedVideos: true,
                joinRequests: {
                  where: {
                    OR: [
                      // received join requests
                      {
                        approvedByOwners: {
                          none: { email: session.user.email },
                        },
                      },
                      // approval pending join requests
                      {
                        AND: [
                          {
                            approvedByOwners: {
                              some: { email: session.user.email },
                            },
                          },
                          { isApprovedByOwners: false },
                        ],
                      },
                      // sent join requests
                      {
                        isApprovedByOwners: true,
                      },
                    ],
                  },
                },
              },
            },
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ ...dbResult });
  } catch {
    return NextResponse.json(
      { error: "Error fetching results" },
      { status: 500 }
    );
  }
}
