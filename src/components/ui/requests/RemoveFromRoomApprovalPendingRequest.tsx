"use client";

import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";
import { ScrollArea } from "../shadcn/scroll-area";
import { Separator } from "../shadcn/separator";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FullWidthBg } from "..";
import { useToast } from "../shadcn/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  toUser: {
    name: string;
    email: string;
  };
  approvedByOwners: { name: string; email: string }[];
  owners: { name: string; email: string }[];
  requestId: string;
};

export function RemoveFromRoomApprovalPendingRequest({
  requestId,
  toUser,
  approvedByOwners,
  owners,
}: Props) {
  const { data: session } = useSession();
  let [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleCancel() {
    await axios.post("http://localhost:3000/api/cancel-remove-request", {
      requestId,
    });
    // window.location.reload();
    router.refresh();
    toast({
      description: "Cancelled remove request.",
    });
  }
  return (
    <FullWidthBg className="p-4 ">
      <div
        onClick={() => {
          setIsOpen((currenState) => !currenState);
        }}
      >
        <div className="flex justify-between text-gray-900 dark:text-white text-lg">
          <div className="flex flex-col gap-2">
            <p>
              {`Remove ${toUser.name} (${toUser.email}) from this room (${session?.user.roomName}).`}
            </p>
            {isOpen ? (
              <>
                <div className="flex space-x-5 text-gray-800 dark:text-gray-300 pt-7">
                  <div className="flex space-x-2">
                    <div className="italic"> Approved by: </div>
                    <ScrollArea className="max-h-72 w-48 rounded-md border dark:bg-black">
                      <div className="p-4">
                        {approvedByOwners.map((user) => (
                          <div key={user.email}>
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
                          .map((user) => (
                            <div key={user.email}>
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
  );
}
