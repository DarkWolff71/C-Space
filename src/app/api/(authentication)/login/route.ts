import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export function POST(req: NextRequest) {
  let {userName, password} = await req.json();
  let prisma = getPrismaClient();
  prisma.user.findUnique({
    where: {
        id: reqBody
  })

  return NextResponse.json(
    { error: "Credentials did not match" },
    { status: 401 }
  );
}
