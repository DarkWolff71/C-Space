"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Role } from "@/lib/roles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog";
import { Listbox, ListboxItem } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { ownersInCurrentRoom } from "@/recoil-store/atoms/members";

type Props = {
  className?: string;
  name: string;
  editors: number;
  owners: number;
  requests: number;
  role: Role;
  unpublishedVideos: number;
};

export function RoomCard({
  className,
  name,
  role,
  owners,
  editors,
  requests,
  unpublishedVideos,
}: Props) {
  let [isOptionsHidden, setIsOptionsHidden] = useState<boolean>(true);
  let [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const listboxRef = useRef<HTMLDivElement | null>(null);
  let [isProcessingrequest, setIsProcessingrequest] = useState(false);
  let router = useRouter();
  const { update: updateSession } = useSession();
  let setOwnersInCurrentRoom = useSetRecoilState(ownersInCurrentRoom);
  let handleCardClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    await updateSession({
      roomName: name,
      role: role === Role.EDITOR ? "editor" : "owner",
    });
    setOwnersInCurrentRoom(owners);
    window.location.reload();
  };

  let handleAlertCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsAlertOpen(false);
  };

  let handleAlertContinue: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;

  let moreOptions: { delete?: string; leave?: string } = {};
  let alertData: { title: string; description: string } = {
    title: "",
    description: "",
  };

  if (role === Role.OWNER && owners === 1) {
    moreOptions.delete = "Delete room";
    alertData.title = `Are you sure you want to delete ${name} room?`;
    alertData.description =
      " This action cannot be undone. This will remove all the creators (if any) from the room and delete the room from our servers.";
    handleAlertContinue = async (e) => {
      e.stopPropagation();
      setIsProcessingrequest(true);
      await axios.delete("http://localhost:3000/api/delete-room", {
        params: { roomName: name },
      });
      await updateSession({ roomName: "", role: "" });
      setIsAlertOpen(false);
      router.refresh();
      setIsProcessingrequest(false);
    };
  } else {
    moreOptions.leave = "Leave room";
    alertData.title = `Are you sure you want to leave the ${name} room?`;
    alertData.description =
      "This action cannot be undone. This will remove you from the room permanently unless the owners of the room wish to have you back.";
    handleAlertContinue = async (e) => {
      e.stopPropagation();
      setIsProcessingrequest(true);
      await axios.put("http://localhost:3000/api/leave-room", {
        roomName: name,
      });
      await updateSession({ roomName: "", role: "" });
      setIsAlertOpen(false);
      router.refresh();
      setIsProcessingrequest(false);
    };
  }

  return (
    <>
      <AlertDialog open={isAlertOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertData.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertData.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleAlertCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertContinue}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div
        onClick={handleCardClick}
        className={cn(
          "block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer min-h-[15%]",
          className
        )}
      >
        <div className="flex justify-between">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h5>
          <div className="">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOptionsHidden((currentState) => !currentState);
              }}
            >
              <MoreVertIcon></MoreVertIcon>
            </button>
            <div
              hidden={isOptionsHidden}
              ref={listboxRef}
              className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 absolute z-[1] dark:bg-black bg-slate-400"
            >
              <Listbox
                items={Object.entries(moreOptions)}
                aria-label="Actions"
                onAction={(key) => {
                  setIsAlertOpen(true);
                  setIsOptionsHidden(true);
                }}
              >
                {(item) => <ListboxItem key={item[0]}>{item[1]}</ListboxItem>}
              </Listbox>
            </div>
          </div>
        </div>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          <p>{`Role: ${role == Role.EDITOR ? "Editor" : "Owner"}`}</p>
          <p>{`Requests: ${requests}`}</p>
          <p>{`Unpublished videos: ${unpublishedVideos}`}</p>
          <p>{`Owners: ${owners}`}</p>
          <p>{`Editors: ${editors}`}</p>
        </div>
      </div>
    </>
  );
}
