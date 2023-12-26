import { atom } from "recoil";
export const ownersInCurrentRoom = atom<number | null>({
  key: "ownersInCurrentRoom",
  default: null,
});
