import {
  JoinRoomApprovalByOwnerReceivedRequest,
  JoinRoomReceievedRequest,
  PageContent,
} from "@/components/ui";
import { RemoveFromRoomApprovalByOwnerReceivedRequest } from "@/components/ui/requests/RemoveFromRoomApprovalByOwnerReceivedRequest";
import { Separator } from "@/components/ui/shadcn/separator";
import { BASE_URL } from "@/lib/config/URL";
import { getCookiesString } from "@/lib/helpers/cookiesString";
import { GetReceivedRequestsResponse } from "@/types/response";
import React from "react";

async function fetchData(url: string) {
  const response = await fetch(url, {
    next: { revalidate: 0 },
    headers: {
      Cookie: getCookiesString(),
    },
  });
  return response.json();
}

export default async function ReceivedRequests() {
  const {
    joinRequests,
    joinRoomApproveRequests,
    removeFromRoomApproveRequests,
  }: GetReceivedRequestsResponse = await fetchData(
    `${BASE_URL}/api/get-received-requests`
  );

  return (
    <>
      <PageContent title="Received Requests">
        <div className="space-y-4">
          {joinRoomApproveRequests?.map((request) => {
            return (
              <JoinRoomApprovalByOwnerReceivedRequest
                key={request.id}
                {...{ ...request, requestId: request.id }}
              ></JoinRoomApprovalByOwnerReceivedRequest>
            );
          })}
          {removeFromRoomApproveRequests?.map((request) => {
            return (
              <RemoveFromRoomApprovalByOwnerReceivedRequest
                key={request.id}
                {...{ ...request, requestId: request.id }}
              ></RemoveFromRoomApprovalByOwnerReceivedRequest>
            );
          })}
          {(joinRoomApproveRequests && joinRoomApproveRequests.length > 0) ||
          (removeFromRoomApproveRequests &&
            removeFromRoomApproveRequests.length > 0) ? (
            <Separator className="my-2" />
          ) : null}
          {joinRequests.map((request) => {
            let props = {
              requestId: request.id,
              role: request.role,
              roomName: request.fromRoom.name,
              editors: request.fromRoom.editors ?? [],
              owners: request.fromRoom.owners ?? [],
            };
            return (
              <JoinRoomReceievedRequest
                key={request.id}
                {...props}
              ></JoinRoomReceievedRequest>
            );
          })}
        </div>
      </PageContent>
    </>
  );
}
