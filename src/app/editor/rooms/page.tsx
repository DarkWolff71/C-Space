import { CreateRoomCard, PageContent, RoomCard } from "@/components/ui";
import { Role } from "@/lib/roles";
import { getRoomsResponse } from "@/types/response";
import React from "react";
import { getCookiesString } from "@/lib/helpers/cookiesString";

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
  // TODO: Remove tempProps after testing
  let tempProps = {
    editors: 2,
    owners: 5,
    role: Role.EDITOR,
    name: "Dark Wold",
    requests: 45,
    unpublishedVideos: 56,
  };
  let roomsData: getRoomsResponse = await getRoomsData();

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
                  }}
                ></RoomCard>
              );
            })}

          {/* TODO: Remove this after testing 
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard>
          <RoomCard {...tempProps} className="w-full"></RoomCard> */}
        </div>
      </PageContent>
    </>
  );
}
