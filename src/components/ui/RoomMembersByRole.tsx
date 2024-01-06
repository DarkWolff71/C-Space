"use client";

import React, { useState } from "react";
import { FullWidthBg } from ".";
import { Avatar } from "@nextui-org/react";
import { Separator } from "@/components/ui/shadcn/separator";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { cn } from "@/lib/utils";
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
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "./shadcn/use-toast";
import { useRouter } from "next/navigation";

enum Role {
  OWNER,
  EDITOR,
}

type Props = {
  members: { name: string; image?: string | null; email: string }[];
  role: Role;
  ownersCount?: number;
};

export function RoomMembersByRole({ members, role, ownersCount }: Props) {
  const router = useRouter();
  let [filteredMembersList, setFilteredMembersList] = useState(members);
  let [searchInputValue, setSearchInputValue] = useState<string>("");
  let [memberEmail, setMemberEmail] = useState("");
  const { toast } = useToast();
  let [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  let [alertData, setAlertData] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });
  let { data: session } = useSession();
  let isRemoveMemberHidden = false;
  if (session?.user.role == "owner") {
    isRemoveMemberHidden = false;
  } else {
    isRemoveMemberHidden = true;
  }
  let inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    setSearchInputValue(inputValue);
    if (inputValue) {
      setFilteredMembersList(
        members.filter((member) => member.name.startsWith(inputValue.trim()))
      );
    } else {
      setFilteredMembersList(members);
    }
  };

  let removeMemberTrigger = (member: {
    name: string;
    image?: string | null;
    email: string;
  }) => {
    setMemberEmail(member.email);
    let alertDataInfo: {
      title: string;
      description: string;
    } = { title: "", description: "" };
    alertDataInfo.title = `Are you sure you want to remove ${member.name} from the room?`;
    if (session?.user.role == "owner" && ownersCount) {
      if (ownersCount > 1) {
        alertDataInfo.description = `As there more than one owner to this room, you need the approval of all the owners to remove a person from this room. On conitnuing, all the owners will receiev a request to remove ${member.name} from this room. On every owner's approval, ${member.name} will be successfully removed.`;
      } else {
        alertDataInfo.description = ``;
      }
    }
    setAlertData(alertDataInfo);
    setIsAlertOpen(true);
  };

  let handleAlertCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsAlertOpen(false);
  };

  let handleAlertContinue = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const response = await axios.post(
      "http://localhost:3000/api/remove-member",
      {
        userEmail: memberEmail,
      }
    );
    router.refresh();
    //window.location.reload();
    if (response.data.message == "success") {
      toast({
        description: "Succesfully removed.",
      });
    } else {
      toast({
        description: "Succesfully sent request to all the owners.",
      });
    }
  };

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

      <FullWidthBg className="w-full p-3 flex flex-col">
        <p className="text-2xl font-medium text-gray-900 dark:text-gray-200 flex justify-center mb-2">
          {role == Role.EDITOR ? "Editors" : "Owners"}
        </p>
        {role == Role.EDITOR && members.length === 0 ? (
          <div className="flex items-center justify-center flex-grow w-full bg-slate-400 dark:bg-black rounded-lg p-3 pt-2">
            -- No editors in this room --
          </div>
        ) : (
          <>
            <input
              type="search"
              className="bg-slate-400 dark:bg-black w-[70%] rounded-lg mb-2 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700"
              placeholder={
                role == Role.EDITOR
                  ? "Search in editors..."
                  : "Search in owners..."
              }
              onChange={inputChangeHandler}
            ></input>
            <div className="bg-slate-400 dark:bg-black rounded-lg p-3 pt-2">
              {filteredMembersList.map((member, id) => {
                return (
                  <div key={id.toString()}>
                    <div className="my-2 flex justify-between items-center">
                      <div>{member.name}</div>
                      <div className="gap-x-2 flex items-center">
                        <Avatar
                          isBordered
                          radius="sm"
                          src={member.image || ""}
                          className={cn({
                            "mr-7 ":
                              session?.user.email === member.email ||
                              isRemoveMemberHidden,
                          })}
                        />
                        <button
                          hidden={session?.user.email === member.email}
                          onClick={(e) => {
                            e.stopPropagation();

                            removeMemberTrigger(member);
                          }}
                          className={cn(
                            "rounded-full w-max h-max bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center",
                            {
                              hidden:
                                session?.user.email === member.email ||
                                isRemoveMemberHidden,
                            }
                          )}
                        >
                          <CloseRoundedIcon fontSize="small"></CloseRoundedIcon>
                        </button>
                      </div>
                    </div>
                    <Separator />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </FullWidthBg>
    </>
  );
}
