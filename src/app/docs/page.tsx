import { PageContent, PageTitle } from "@/components/ui";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <>
      <div className="p-4 flex flex-col min-h-screen">
        <PageTitle>{"Welcome to C-Space Docs"}</PageTitle>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div>
            <div className="container mx-auto p-4">
              <div className="mb-8">
                <p className="text-lg">
                  C-Space is a platform designed to address a common challenge
                  faced by YouTubers. Many YouTubers keep traveling to different
                  places, exploring remote locations, and are on the go many
                  times. So, they frequently find themselves in locations with
                  limited internet access or expensive data packs, hindering
                  their ability to download large edited video files sent by
                  their editors. One might argue that adding the editors to
                  their YouTube studio account would solve the issue. But this
                  would give complete access to the editors causing paranoia for
                  the YouTubers and causing security concerns as now their
                  editors can publish anything on their behalf. To avoid
                  compromising their YouTube Studio account security but still
                  getting the job done, C-Space offers a solution.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Solution:</h2>
                <p className="text-lg">
                  On C-Space, YouTubers and editors can sign up. Editors can
                  upload videos, and until approved by the owners, the videos
                  remain on C-Space servers. Once approved, videos are directly
                  published to the YouTuber's YouTube account without the need
                  to download large files.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  Terminology and Usage:
                </h2>
                <ul className="list-disc list-inside text-lg">
                  <li>
                    <strong>Rooms:</strong> Analogous to YouTube channels, users
                    can be part of multiple rooms. A user can serve as either an
                    editor or an owner in a specific room.
                  </li>
                  <li>
                    <strong>Owners:</strong> Owners have the authority to add,
                    edit, and publish videos to YouTube. They can also manage
                    room members. In rooms with multiple owners, all the actions
                    except adding and editng videos require consensus from all
                    owners.
                    <div className="ml-12">
                      Example: To publish a video or remove a member, all owners
                      must agree.
                    </div>
                  </li>
                  <li>
                    <strong>Editors:</strong> Editors can upload and edit
                    videos.
                  </li>
                </ul>
              </div>

              <p className="text-lg">
                Owners and editors collaborate within rooms, ensuring a secure
                and efficient video management process. The consensus mechanism
                for certain actions guarantees collective decision-making in
                multi-owner rooms.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <div className="font-semibold">
                <span>{"Experience the platform by clicking "}</span>
                <Link href={"c-space.online"}>
                  <span className=" text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 font-bold">
                    here
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
