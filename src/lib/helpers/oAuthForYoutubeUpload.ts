import { google } from "googleapis";
import { BASE_URL } from "../config/URL";

export const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${BASE_URL}/api/yt-oauth-redirect`
);
const scopes =
  "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile";

export const oAuthYoutubeUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});
