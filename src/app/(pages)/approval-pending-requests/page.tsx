import {
  JoinRoomApprovalPendingRequest,
  PageContent,
  RemoveFromRoomApprovalPendingRequest,
} from "@/components/ui/";
import { getCookiesString } from "@/lib/helpers/cookiesString";
import { Role } from "@prisma/client";
import React from "react";

type User = {
  name: string;
  email: string;
};

type ApprovalPendingJoinRequest = {
  id: string;
  displayOwners: boolean;
  displayEditors: boolean;
  role: Role;
  toUser: User;
  approvedByOwners: User[];
};

type ApprovalPendingRemoveRequest = {
  id: string;
  toUser: User;
  approvedByOwners: User[];
};

type ApprovalPendingRequestsResponse = {
  approvalPendingJoinRequests: ApprovalPendingJoinRequest[];
  approvalPendingRemoveRequests: ApprovalPendingRemoveRequest[];
};

async function fetchData(url: string) {
  const response = await fetch(url, {
    next: { revalidate: 0 },
    headers: {
      Cookie: getCookiesString(),
    },
  });
  return response.json();
}

export default async function ApprovalPendingRequests() {
  const [approvalPendingRequestsResponse, roomOwnersResponse] =
    await Promise.all([
      fetchData("http://localhost:3000/api/get-approval-pending-requests"),
      fetchData("http://localhost:3000/api/get-room-owners"),
    ]);
  const {
    approvalPendingJoinRequests,
    approvalPendingRemoveRequests,
  }: ApprovalPendingRequestsResponse = approvalPendingRequestsResponse;

  const {
    owners,
  }: {
    owners:
      | {
          name: string;
          email: string;
        }[]
      | null;
  } = roomOwnersResponse;

  return (
    <>
      <PageContent title="Approval Pending Requests">
        <div className="space-y-4">
          {approvalPendingJoinRequests.map((request) => {
            const props = {
              requestId: request.id,
              displayOwners: request.displayOwners,
              displayEditors: request.displayEditors,
              approvedByOwners: request.approvedByOwners ?? [],
              role: request.role,
              toUser: request.toUser,
              owners: owners ?? [],
            };
            return (
              <JoinRoomApprovalPendingRequest
                key={request.id}
                {...props}
              ></JoinRoomApprovalPendingRequest>
            );
          })}
          {approvalPendingRemoveRequests.map((request) => {
            const props = {
              requestId: request.id,
              approvedByOwners: request.approvedByOwners ?? [],
              toUser: request.toUser,
              owners: owners ?? [],
            };
            return (
              <RemoveFromRoomApprovalPendingRequest
                key={request.id}
                {...props}
              ></RemoveFromRoomApprovalPendingRequest>
            );
          })}
        </div>
      </PageContent>
    </>
  );
}
