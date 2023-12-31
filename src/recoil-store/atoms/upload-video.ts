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

export const isVideoFileChanged = atom<boolean>({
  key: "isVideoFileChanged",
  default: false,
});

export const videoUploadPercentage = atom<number>({
  key: "videoUploadPercentage",
  default: 0,
});
