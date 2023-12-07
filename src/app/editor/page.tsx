"use client";
import {
  EditorSideBar,
  FullWidthBg,
  PageContent,
  FileUpload,
} from "@/components/ui";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";

export default function Editor() {
  let name = "Fdsfds";
  let [publishPendingVideos, setPublishPendingVideos] = useState<number>(0);

  return (
    <>
      <EditorSideBar></EditorSideBar>
      <PageContent title={`${name}'s Dashboard`}>
        <div className="grid grid-cols-2 gap-4 mb-0">
          <div>
            <FullWidthBg className="md:min-h-[36vh] md:max-h-[36vh] flex flex-col px-4 pb-4 pt-2 mb-4">
              <p className="text-2xl font-medium text-gray-900 dark:text-gray-200 flex justify-center ">
                Upload a video
              </p>
              {/* <div className="p-4 mt-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 min-h-[26vh] h-full flex items-center justify-center"> */}
              {/* <p>Click to choose a file or drag and drop a file</p>
                <AddIcon></AddIcon> */}
              {/* <FileUpload></FileUpload> */}
              {/* </div> */}
              <FileUpload className="mt-2 h-full"></FileUpload>
            </FullWidthBg>
            <FullWidthBg className="md:min-h-[36vh] md:max-h-[36vh] ">
              <p className="text-2xl font-medium text-gray-900 dark:text-gray-200 flex justify-center ">
                Publish pending videos
              </p>

              {publishPendingVideos == 0 ? (
                <p>None</p>
              ) : (
                <p>{publishPendingVideos}</p>
              )}
            </FullWidthBg>
          </div>
          <div>
            <FullWidthBg className="md:min-h-[36vh] md:max-h-[36vh] mb-4">
              <p className="text-2xl font-medium text-gray-900 dark:text-gray-200 flex justify-center ">
                Messages
              </p>
            </FullWidthBg>
            <FullWidthBg className="md:min-h-[36vh] md:max-h-[36vh] ">
              <p className="text-2xl font-medium text-gray-900 dark:text-gray-200 flex justify-center ">
                Requests
              </p>
            </FullWidthBg>
          </div>
        </div>
      </PageContent>
    </>
  );
}
