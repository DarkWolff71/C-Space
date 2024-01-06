import { CreateRoomCard, PageContent, RoomCard } from "@/components/ui";
import { Role } from "@/lib/constants/roles";
import { GetRoomsResponse } from "@/types/response";
import React from "react";
import { getCookiesString } from "@/lib/helpers/cookiesString";
import { authOptions } from "../api/(authentication)/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

async function getRoomsData() {
  let response = await fetch("http://localhost:3000/api/get-rooms", {
    headers: {
      Cookie: getCookiesString(),
    },
  });
  const responseBody = await response.json();

  return responseBody;
}

export default async function RoomsPage() {
  let roomsData: GetRoomsResponse = await getRoomsData();
  const session = await getServerSession(authOptions);
  const roleInCurrentRoom =
    session?.user.role === "editor" ? Role.EDITOR : Role.OWNER;
  const ownersInCurrentRoom = session?.user.ownersInCurrentRoom ?? 0;

  return (
    <>
      <PageContent title="Rooms">
        <CreateRoomCard className="mb-4"></CreateRoomCard>
        <div className="grid grid-cols-4 gap-4 ">
          {roomsData?.ownerRooms &&
            roomsData?.ownerRooms.map((room) => {
              return (
                <RoomCard
                  key={room.name}
                  {...{
                    editors: room._count.editors,
                    owners: room._count.owners,
                    role: Role.OWNER,
                    name: room.name,
                    requests: room._count.joinRequests,
                    unpublishedVideos: room._count.unpublishedVideos,
                    ownersInCurrentRoom: ownersInCurrentRoom,
                    roleInCurrentRoom: roleInCurrentRoom,
                  }}
                ></RoomCard>
              );
            })}
          {roomsData?.editorRooms &&
            roomsData?.editorRooms.map((room) => {
              return (
                <RoomCard
                  key={room.name}
                  {...{
                    editors: room._count.editors,
                    owners: room._count.owners,
                    role: Role.EDITOR,
                    name: room.name,
                    requests: room._count.joinRequests,
                    unpublishedVideos: room._count.unpublishedVideos,
                    ownersInCurrentRoom: ownersInCurrentRoom,
                    roleInCurrentRoom: roleInCurrentRoom,
                  }}
                ></RoomCard>
              );
            })}
        </div>
      </PageContent>
    </>
  );
}
