import { MembersSearch, PageContent } from "@/components/ui";
import React from "react";
import { RoomMembersByRole } from "@/components/ui/RoomMembersByRole";
import { Role } from "@/lib/constants/roles";
import axios from "axios";
import { GetRoomMembersResponse } from "@/types/response";
import { getServerSession } from "next-auth";
import { getCookiesString } from "@/lib/helpers/cookiesString";
import { authOptions } from "@/app/api/(authentication)/auth/[...nextauth]/options";

async function getRoomMembersData() {
  let response = await axios.get("http://localhost:3000/api/get-room-members", {
    headers: {
      Cookie: getCookiesString(),
    },
  });
  return response.data;
}

export default async function MemebersPage() {
  let session = await getServerSession(authOptions);
  let membersData: GetRoomMembersResponse = await getRoomMembersData();

  return (
    <>
      <PageContent title="Members">
        <div className="flex flex-col gap-4">
          {session?.user.role == "owner" ? (
            <MembersSearch></MembersSearch>
          ) : null}
          <div className="flex gap-10 w-full">
            {membersData?.owners ? (
              <RoomMembersByRole
                members={membersData?.owners}
                role={Role.OWNER}
              ></RoomMembersByRole>
            ) : null}
            {membersData?.editors ? (
              <RoomMembersByRole
                members={membersData.editors}
                role={Role.EDITOR}
              ></RoomMembersByRole>
            ) : null}
          </div>
        </div>
      </PageContent>
    </>
  );
}
