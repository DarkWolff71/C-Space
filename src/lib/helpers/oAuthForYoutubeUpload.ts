import { google } from "googleapis";

export const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/yt-oauth-redirect"
);
const scopes =
  "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile";

export const oAuthYoutubeUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});
