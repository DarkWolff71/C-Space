import { PageContent, UnpublishedVideoCard } from "@/components/ui";
import { getCookiesString } from "@/lib/helpers/cookiesString";
import { GetUnpublishedVideosResponse } from "@/types/response";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../api/(authentication)/auth/[...nextauth]/options";
import { Role } from "@/lib/constants/roles";
import { VideoPrivacyStatus } from "@prisma/client";
import { BASE_URL } from "@/lib/config/URL";

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

export default async function page() {
  const videosData = fetchData(
    `${BASE_URL}/api/get-unpublished-videos`
  );
  const ownersData = fetchData(`${BASE_URL}/api/get-room-owners`);

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
      </PageContent>
    </>
  );
}
