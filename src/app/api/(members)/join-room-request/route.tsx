import { NextRequest, NextResponse } from "next/server";
import { joinRoomRequestValidator } from "@/validators/joinRoomRequestValidator";
import { getPrismaClient } from "@/lib/prisma";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";

let prisma = getPrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  return NextResponse.json({ message: "Succefully created the join request." });
}
