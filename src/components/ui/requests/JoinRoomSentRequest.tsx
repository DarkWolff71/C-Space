"use client";

import React from "react";
import { FullWidthBg } from "..";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useToast } from "../shadcn/use-toast";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/lib/config/URL";

type Props = {
  requestId: string;
  toUser: { name: string; email: string };
  role: Role;
  displayEditors: boolean;
  displayOwners: boolean;
};

export function JoinRoomSentRequest({
  requestId,
  toUser,
  displayEditors,
  displayOwners,
  role,
}: Props) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  async function handleCancel() {
    await axios.post(`${BASE_URL}/api/cancel-join-request`, {
      requestId,
    });
    router.refresh();
    toast({
      description: "Cancelled join request.",
    });
  }
  return (
    <>
      <FullWidthBg className="p-4 ">
        <div className="flex justify-between text-gray-900 dark:text-white text-lg">
          <div className="flex flex-col gap-2">
            <p>
              {`Request sent to ${toUser.name} (${
                toUser.email
              }) to join this room (${session?.user.roomName}) as ${
                role === Role.EDITOR ? "editor" : "owner"
              }.`}
            </p>
            <div className="flex space-x-3 items-center">
              <p>{`Show editors: `}</p>
              {displayEditors ? (
                <DoneRoundedIcon
                  fontSize="medium"
                  className="bg-green-500 p-1 rounded-full"
                />
              ) : (
                <CloseRoundedIcon
                  fontSize="medium"
                  className="bg-red-500 p-1 rounded-full"
                />
              )}
            </div>
            <div className="flex space-x-3 items-center">
              <p>{`Show owners: `}</p>
              {displayOwners ? (
                <DoneRoundedIcon
                  fontSize="medium"
                  className="bg-green-500 p-1 rounded-full"
                />
              ) : (
                <CloseRoundedIcon
                  fontSize="medium"
                  className="bg-red-500 p-1 rounded-full"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
          </div>
        </div>
      </FullWidthBg>
    </>
  );
}
