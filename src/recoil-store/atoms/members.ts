import { Role } from "@/lib/constants/roles";
import { atom } from "recoil";
export const ownersInCurrentRoom = atom<number | null>({
  key: "ownersInCurrentRoom",
  default: null,
});

export const roleInCurrentRoom = atom<Role>({
  key: "roleInCurrentRoom",
  default: Role.EDITOR,
});
