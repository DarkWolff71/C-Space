import { atom } from "recoil";

export const categoryIdState = atom({
  key: "categoryId",
});

export const privacyStatusState = atom({
  key: "privacyStatus",
  default: "private",
});
