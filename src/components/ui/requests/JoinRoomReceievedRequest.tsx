"use client";

import React from "react";
import { FullWidthBg } from "..";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { Role } from "@prisma/client";
import { ScrollArea } from "../shadcn/scroll-area";
import { Separator } from "../shadcn/separator";
import { useToast } from "../shadcn/use-toast";

type Props = {
  requestId: string;
  roomName: string;
  role: Role;
  editors: {name:string, email:string}[];
  owners: {name:string, email:string}[];
};

export function JoinRoomReceievedRequest({
  requestId,
  roomName,
  role,
  owners,
  editors,
}: Props) {
  const { toast } = useToast();

  async function handleAccept() {
    await axios.post("http://localhost:3000/api/accept-join-request", {
      requestId,
    });
    toast({
      description: "Accepted join request.",
    });
  }

  async function handleReject() {
    await axios.post("http://localhost:3000/api/cancel-join-request", {
      requestId,
    });
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
              {`Request from ${roomName} room to join their room as ${
                role === Role.EDITOR ? "editor" : "owner"
              }.`}
            </p>

            {owners || editors ? (
              <div className="flex space-x-5 text-gray-800 dark:text-gray-300 pt-7">
                {owners.length > 0 ? (
                  <div className="flex space-x-2">
                    <div className="italic"> Owners: </div>
                    <ScrollArea className="max-h-72 w-48 rounded-md border dark:bg-black">
                      <div className="p-4">
                        {owners.map((user) => (
                          <div key={user.email}>
                            <div className="text-base">{user.name}</div>
                            <Separator className="my-2" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <></>
                )}
                {editors.length > 0 ? (
                  <div className="flex space-x-2">
                    <div className="italic">Editors: </div>
                    <ScrollArea className="max-h-72 w-48 rounded-md border dark:bg-black">
                      <div className="p-4">
                        {editors.map((user) => (
                          <div key={user.email}>
                            <div className="text-base">{user.name}</div>
                            <Separator className="my-2" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            <Button onClick={handleAccept} color="primary">
              Accept
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
