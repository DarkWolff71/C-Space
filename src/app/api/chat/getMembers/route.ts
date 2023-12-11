import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

let prisma = getPrismaClient();

export async function GET(req: NextRequest) {
  let userId = req.nextUrl.searchParams.get("userId");
  let roomId = req.nextUrl.searchParams.get("roomId");
  if (!userId || !roomId)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  let roomWithUserId = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      owners: { where: { id: userId } },
      editors: { where: { id: userId } },
    },
  });
  if (roomWithUserId?.owners.length == 0 || roomWithUserId?.editors.length == 0)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  let roomMembers = await prisma.room.findUnique({
    where: { id: roomId },
    include: { owners: true, editors: true },
  });
  let editors = roomMembers?.editors || [];
  let owners = roomMembers?.owners || [];

  let result = [...editors, ...owners].map((member) => {
    return {
      id: member.id,
      name: member.name,
      state: member.state,
    };
  });
  return NextResponse.json(result);
}
