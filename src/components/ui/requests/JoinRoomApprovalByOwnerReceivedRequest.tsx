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

type Props = {
  requestId: string;
  toUser: {
    name: string;
    email: string;
  };
  role: Role;
  displayOwners: boolean;
  displayEditors: boolean;
};

export function JoinRoomApprovalByOwnerReceivedRequest({
  requestId,
  toUser,
  displayEditors,
  displayOwners,
  role,
}: Props) {
  const { data: session } = useSession();
  const { toast } = useToast();

  async function handleAccept() {
    await axios.post("http://localhost:3000/api/approve-join-request", {
      requestId,
    });
    window.location.reload();
    toast({
      description: "Approved join request.",
    });
  }
  async function handleReject() {
    await axios.post("http://localhost:3000/api/cancel-join-request", {
      requestId,
    });
    window.location.reload();
    toast({
      description: "Rejected join request.",
    });
  }
  return (
    <>
      <FullWidthBg className="p-4 ">
        <div className="flex justify-between text-gray-900 dark:text-white text-lg">
          <div className="flex flex-col gap-2">
            <p>
              {`Send request to ${toUser.name} (${
                toUser.email
              }) join this room (${session?.user.roomName}) as ${
                role === Role.EDITOR ? "editor" : "owner"
              }.`}
            </p>
            <div className="flex space-x-3 items-center">
              <p>{`Show editors: `}</p>{" "}
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
            <Button onClick={handleAccept} color="primary">
              Approve
            </Button>
            <Button onClick={handleReject} color="primary">
              Reject
            </Button>
          </div>
        </div>
      </FullWidthBg>
    </>
  );
}
