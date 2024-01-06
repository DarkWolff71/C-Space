import { getPrismaClient } from "@/lib/helpers/prisma";
import { videoEditableRequestValidator } from "@/validators/unpublishedVideosValidator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../(authentication)/auth/[...nextauth]/options";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  const validatedRequest = videoEditableRequestValidator.safeParse(
    await req.json()
  );
  const session = await getServerSession(authOptions);

  if (
    !(
      validatedRequest.success === true &&
      session &&
      session.user.email &&
      session.user.roomName
    )
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  let dbResponse = await prisma.video.findUnique({
    where: {
      id: validatedRequest.data.videoId,
      room: {
        name: session.user.roomName,
      },
    },
    select: {
      isEditable: true,
      thumbnailS3Key: true,
    },
  });

  if (dbResponse?.isEditable === true) {
    return NextResponse.json({ state: "editable" });
  }

  return NextResponse.json({ state: "not editable" });
}
