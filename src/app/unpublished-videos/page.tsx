import { PageContent, UnpublishedVideoCard } from "@/components/ui";
import { getCookiesString } from "@/lib/helpers/cookiesString";
import { GetUnpublishedVideosResponse } from "@/types/response";
import axios from "axios";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/(authentication)/auth/[...nextauth]/options";
// import { roleInCurrentRoom } from "@/recoil-store/atoms/members";
import { Role } from "@/lib/constants/roles";
import { VideoPrivacyStatus } from "@prisma/client";

function getPrivacyStatusString(privacyStatus: VideoPrivacyStatus) {
  switch (privacyStatus) {
    case VideoPrivacyStatus.PRIVATE:
      return "private";
    case VideoPrivacyStatus.UNLISTED:
      return "unlisted";
    case VideoPrivacyStatus.PUBLIC:
      return "public";
  }
}

async function fetchData(url: string) {
  const response = await fetch(url, {
    next: { revalidate: 0 },
    headers: {
      Cookie: getCookiesString(),
    },
  });
  return response.json();
}

async function getData() {
  let videosPromise = axios.get(
    "http://localhost:3000/api/get-unpublished-videos"
  );
  let ownersPromise = axios.get("http://localhost:3000/api/get-room-owners");
  let [videosResponse, ownersResponse] = await Promise.all([
    videosPromise,
    ownersPromise,
  ]);
  return { videos: videosResponse.data, owners: ownersResponse.data };
}

export default async function page() {
  const videosData = fetchData(
    "http://localhost:3000/api/get-unpublished-videos"
  );
  const ownersData = fetchData("http://localhost:3000/api/get-room-owners");

  const [{ videos }, ownersResponse]: [
    GetUnpublishedVideosResponse,
    {
      owners: {
        name: string;
        email: string;
      }[];
    } | null
  ] = await Promise.all([videosData, ownersData]);

  const session = await getServerSession(authOptions);
  const roleInCurrentRoom =
    session?.user.role === "editor" ? Role.EDITOR : Role.OWNER;
  const ownersInCurrentRoom = session?.user.ownersInCurrentRoom;
  // let {
  //   videos,
  //   owners,
  // }: {
  //   videos: GetUnpublishedVideosResponse;
  //   owners: {
  //     owners: {
  //       name: string;
  //       email: string;
  //     }[];
  //   } | null;
  // } = await getData();

  return (
    <>
      <PageContent title="Unpublished Videos">
        <div className="space-y-4">
          {videos?.map((video) => {
            return (
              <UnpublishedVideoCard
                key={video.id}
                {...video}
                privacyStatus={getPrivacyStatusString(video.privacyStatus)}
                owners={ownersResponse?.owners ?? []}
                roleInCurrentRoom={roleInCurrentRoom}
                ownersInCurrentRoom={ownersInCurrentRoom ?? 0}
              ></UnpublishedVideoCard>
            );
          })}
        </div>
        {/* <UnpublishedVideoCard
          {...{
            id: ",",
            title: "Title",
            description: " string | null",
            tags: ["vg"],
            thumbnailUrl: "",
            videoType: null,
            videoFileSize: null,
            privacyStatus: "private",
            categoryId: null,
            isEditable: true,
            sentForApproval: null,
            isApproved: false,
            _count: {
              approvedByOwners: 2,
            },
            owners: [],
            approvedByOwners: [],
          }}
        ></UnpublishedVideoCard> */}
      </PageContent>
    </>
  );
}
