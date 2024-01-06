import { atom } from "recoil";

export const categoryIdState = atom({
  key: "categoryId",
  default: "",
});

export const privacyStatusState = atom<"private" | "unlisted" | "public">({
  key: "privacyStatus",
  default: "private",
});

export const videoDescription = atom({
  key: "videoDescription",
  default: "",
});

export const videoTitle = atom({
  key: "videoTitle",
  default: "",
});

export const videoTags = atom<string[]>({
  key: "videoTags",
  default: [],
});

export const videoId = atom<string | null>({
  key: "videoId",
  default: null,
});

export const videoFile = atom<File | null>({
  key: "videoFile",
  default: null,
});

export const videoFileSize = atom<number | null>({
  key: "videoFileSize",
  default: null,
});

export const videoFileType = atom<string | null>({
  key: "videoFileType",
  default: null,
});

export const isVideoFileChanged = atom<boolean>({
  key: "isVideoFileChanged",
  default: false,
});

export const thumbnailFile = atom<File | null>({
  key: "thumbnailFile",
  default: null,
});

export const thumbnailFileUrl = atom<string>({
  key: "thumbnailFileUrl",
  default: "",
});

export const isThumbnailFileChanged = atom<boolean>({
  key: "isThumbnailFileChanged",
  default: false,
});

export const videoUploadPercentage = atom<number>({
  key: "videoUploadPercentage",
  default: 0,
});

export const isThumbnailAlreadyPresent = atom<boolean>({
  key: "isThumbnailAlreadyPresent",
  default: false,
});

export const isVideoAlreadyPresent = atom<boolean>({
  key: "isVideoAlreadyPresent",
  default: false,
});
