import { oAuth2Client } from "@/lib/helpers/oAuthForYoutubeUpload";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authCode = req.nextUrl.searchParams.get("code") as string;
  if (authCode) {
    let tokenResponse = await oAuth2Client.getToken(authCode);
    cookies().set(
      "yt-token",
      JSON.stringify({
        accessToken: tokenResponse.tokens.access_token,
        refreshToken: tokenResponse.tokens.refresh_token,
      })
    );
    redirect("/unpublished-videos");
  }

  return NextResponse.json({}, { status: 500 });
}
