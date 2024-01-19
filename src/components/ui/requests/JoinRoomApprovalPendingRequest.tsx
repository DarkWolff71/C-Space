"use client";

import React, { useState } from "react";
import { FullWidthBg } from "..";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../shadcn/separator";
import { ScrollArea } from "../shadcn/scroll-area";
import { useToast } from "../shadcn/use-toast";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/lib/config/URL";

type Props = {
  requestId: string;
  toUser: {
    name: string;
    email: string;
  };
  role: Role;
  displayEditors: boolean;
  displayOwners: boolean;
  approvedByOwners: { name: string; email: string }[];
  owners: { name: string; email: string }[];
};

export function JoinRoomApprovalPendingRequest({
  requestId,
  toUser,
  displayEditors,
  displayOwners,
  role,
  approvedByOwners,
  owners,
}: Props) {
  const { data: session } = useSession();
  let [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleCancel() {
    await axios.post(`${BASE_URL}/api/cancel-join-request`, {
      requestId,
    });
    router.refresh();
    toast({
      description: "Join request cancelled successfully.",
    });
  }

  return (
    <>
      <FullWidthBg className="p-4 ">
        <div
          onClick={() => {
            setIsOpen((currenState) => !currenState);
          }}
        >
          <div className="flex justify-between text-gray-900 dark:text-white text-lg">
            <div className="flex flex-col gap-2">
              <p>
                {`Send request to ${toUser.name} (${
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
              {isOpen ? (
                <>
                  <div className="flex space-x-5 text-gray-800 dark:text-gray-300 pt-7">
                    <div className="flex space-x-2">
                      <div className="italic"> Approved by: </div>
                      <ScrollArea className="max-h-72 w-48 rounded-md border dark:bg-black">
                        <div className="p-4">
                          {approvedByOwners.map((user, index) => (
                            <div key={index}>
                              <div className="text-base">{user.name}</div>
                              <Separator className="my-2" />
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <div className="flex space-x-2">
                      <div className="italic">Approval pending by: </div>
                      <ScrollArea className="max-h-72 w-48 rounded-md border dark:bg-black">
                        <div className="p-4">
                          {owners
                            .filter(
                              (owner) =>
                                !approvedByOwners.some(
                                  (approvedOwner) =>
                                    approvedOwner.email === owner.email
                                )
                            )
                            .map((user, index) => (
                              <div key={index}>
                                <div className="text-base">{user.name}</div>
                                <Separator className="my-2" />
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="flex  gap-3">
              <div className=" flex justify-center items-center">
                <Button onClick={handleCancel} color="primary">
                  Cancel
                </Button>
              </div>
              <div className="flex-shrink-0 w-auto  ml-auto">
                <ChevronDownIcon
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    {
                      "transform rotate-180": isOpen,
                    }
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </FullWidthBg>
    </>
  );
}
