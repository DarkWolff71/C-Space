import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const ROOMS_URLS = [
  "/rooms",
  "/api/get-rooms",
  "/api/create-room",
  "/api/delete-room",
  "/api/leave-room",
];

const RECEIVED_REQUESTS_URLS = [
  "/received-requests",
  "/api/get-received-requests",
  "/api/cancel-join-request",
  "/api/accept-join-request",
];

export default withAuth(async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;

  if (RECEIVED_REQUESTS_URLS.includes(path)) {
    return NextResponse.next();
  }
  if (!token?.roomName) {
    if (!ROOMS_URLS.includes(path)) {
      return NextResponse.redirect(new URL("/rooms", req.url));
    }
  }

  return NextResponse.next();
});
