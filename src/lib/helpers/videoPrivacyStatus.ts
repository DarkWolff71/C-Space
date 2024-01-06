import { VideoPrivacyStatus } from "@prisma/client";

export function getVideoPrivacuStatusString(
  status: VideoPrivacyStatus | null | undefined
) {
  switch (status) {
    case VideoPrivacyStatus.PRIVATE:
      return "private";
    case VideoPrivacyStatus.PUBLIC:
      return "public";
    case VideoPrivacyStatus.UNLISTED:
      return "unlisted";
    default:
      return "";
  }
}
