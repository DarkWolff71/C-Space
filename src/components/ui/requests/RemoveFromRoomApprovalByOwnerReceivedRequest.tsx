"use client";

import React from "react";
import { FullWidthBg } from "..";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "../shadcn/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  requestId: string;
  toUser: {
    name: string;
    email: string;
  };
};

export function RemoveFromRoomApprovalByOwnerReceivedRequest({
  requestId,
  toUser,
}: Props) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  async function handleAccept() {
    await axios.post("http://localhost:3000/api/approve-remove-request", {
      requestId,
    });
    router.refresh();
    toast({
      description: "Approved remove request.",
    });
  }

  async function handleReject() {
    await axios.post("http://localhost:3000/api/cancel-remove-request", {
      requestId,
    });
    router.refresh();
    toast({
      description: "Rejected remove request.",
    });
  }

  return (
    <>
      <FullWidthBg className="p-4 ">
        <div className="flex justify-between text-gray-900 dark:text-white text-lg">
          <div className="flex flex-col gap-2">
            <p>
              {`Remove ${toUser.name} (${toUser.email}) from this room (${session?.user.roomName}).`}
            </p>
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
