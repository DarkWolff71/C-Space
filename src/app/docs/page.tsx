import React from "react";

export default function Page() {
  return (
    <>
      <div>
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
            Welcome to C-Space Docs
          </h1>

          <div className="mb-8">
            <p className="text-lg">
              C-Space is a platform designed to address a common challenge faced
              by YouTubers. Frequently, YouTubers find themselves in locations
              with limited internet access or expensive data packs, hindering
              their ability to download large edited video files sent by their
              editors. To avoid compromising their YouTube Studio account
              security by granting access to editors, C-Space offers a solution.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Problem:</h2>
            <p className="text-lg">
              Many YouTubers keep travelling to differnt places, explore remote
              locations, and are on the go many a times making it impractical to
              download large video files sent by editors. Adding editors to
              their YouTube Studio accounts raises security concerns as the
              editors can publish anything on the youtuber's behalf. C-Space
              addresses this issue by providing an alternative solution.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Solution:</h2>
            <p className="text-lg">
              On C-Space, YouTubers and editors can sign up. Editors can upload
              videos, and until approved by the owners, the videos remain on
              C-Space servers. Once approved, videos are directly published to
              the YouTuber's YouTube account without the need to download large
              files.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Terminology and Usage:</h2>
            <ul className="list-disc list-inside text-lg">
              <li>
                <strong>Rooms:</strong> Analogous to YouTube channels, users can
                be part of multiple rooms. A user can serve as either an editor
                or an owner in a specific room.
              </li>
              <li>
                <strong>Owners:</strong> Owners have the authority to add, edit,
                and publish videos to YouTube. They can also manage room
                members. In rooms with multiple owners, all the actions except
                adding and editng videos require consensus from all owners.
                <div className="ml-12">
                  Example: To publish a video or remove a member, all owners
                  must agree.
                </div>
              </li>
              <li>
                <strong>Editors:</strong> Editors can upload and edit videos.
              </li>
            </ul>
          </div>

          <p className="text-lg">
            Owners and editors collaborate within rooms, ensuring a secure and
            efficient video management process. The consensus mechanism for
            certain actions guarantees collective decision-making in multi-owner
            rooms.
          </p>
        </div>
      </div>
    </>
  );
}
