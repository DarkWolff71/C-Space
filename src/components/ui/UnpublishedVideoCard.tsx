"use client";

import { FullWidthBg, PageContent } from "@/components/ui";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  ownersInCurrentRoom,
  roleInCurrentRoom,
} from "@/recoil-store/atoms/members";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Role } from "@/lib/constants/roles";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import axios from "axios";
import Cookies from "js-cookie";

import { RedirectType, redirect } from "next/navigation";
import { toast } from "./shadcn/use-toast";
import {
  categoryIdState,
  isVideoFileChanged,
  privacyStatusState,
  videoDescription,
  videoFile,
  videoId,
  videoTags,
  videoTitle,
  videoUploadPercentage,
} from "@/recoil-store/atoms/upload-video";

type Props = {
  id: string;
  title: string | null;
  description: string | null;
  tags: string[];
  thumbnailUrl: string | null;
  videoType: string | null;
  videoFileSize: number | null;
  privacyStatus: "private" | "public" | "unlisted";
  categoryId: string | null;
  isEditable: boolean;
  sentForApproval: boolean | null;
  isApproved: boolean;
  _count: {
    approvedByOwners: number;
  };
};

export function UnpublishedVideoCard({
  id,
  title,
  description,
  tags,
  thumbnailUrl,
  videoType,
  videoFileSize,
  privacyStatus,
  categoryId,
  isEditable,
  sentForApproval,
  isApproved,
  _count,
}: Props) {
  let [isOpen, setIsOpen] = useState<boolean>(false);
  let [roleInRoomState, setRoleInRoomState] = useRecoilState(roleInCurrentRoom);
  let [ownersInCurrentRoomState, setOwnersInCurrentRoomState] =
    useRecoilState(ownersInCurrentRoom);
  let [isPublishingState, setIsPusblishingState] = useState(false);
  let setvideoTagsState = useSetRecoilState(videoTags);
  let setvideoIdState = useSetRecoilState(videoId);
  let setvideoFileState = useSetRecoilState(videoFile);
  let setvideoUploadPercentageState = useSetRecoilState(videoUploadPercentage);
  let setvideoTitleState = useSetRecoilState(videoTitle);
  let setvideoDescriptionState = useSetRecoilState(videoDescription);
  let setprivacyStatusStateState = useSetRecoilState(privacyStatusState);
  let setcategoryIdStateState = useSetRecoilState(categoryIdState);

  function handleApprove(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    axios.post("http://localhost:3000/api/approve-video", {
      videoId: id,
    });
  }

  function handleSendForApproval(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    axios.post("http://localhost:3000/api/send-video-for-approval", {
      videoId: id,
    });
  }

  async function handleEdit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    let response = await axios.post(
      "http://localhost:3000/api/video-editable",
      {
        videoId: id,
      }
    );
    if (response.data.status === "editable") {
      setvideoIdState(id);
      setvideoDescriptionState(description ?? "");
      setvideoTagsState(tags ?? "");
      setvideoTitleState(title ?? "");
      setprivacyStatusStateState(privacyStatus);
      setcategoryIdStateState(categoryId ?? "");
      if (response.data.videoFileName) {
        const blob = new Blob(["Dummy file"], { type: "text/plain" });
        const dummyFile = new File([blob], response.data.videoFileName);
        setvideoFileState(dummyFile);
        setvideoUploadPercentageState(100);
      }
      redirect("/editor/upload-video");
    } else {
      window.location.reload();
    }
  }

  async function handlePublish(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setIsPusblishingState(true);
    if (Cookies.get("yt-token")) {
      axios.post("http://localhost:3000/api/publish-video", {
        videoId: id,
        ytToken: Cookies.get("yt-token"),
      });
    } else {
      let response = await axios.get("http://localhost:3000/api/get-yt-token");
      redirect(response.data.url, RedirectType.push);
    }
    window.location.reload();
    toast({
      description: "Successfully published to Youtube!!",
    });
  }

  return (
    <>
      <FullWidthBg className="p-4 " enableHover={true}>
        <div
          className="flex flex-col"
          onClick={(e) => setIsOpen((currentState) => !currentState)}
        >
          <div className="flex-grow flex gap-4">
            <div className="flex-shrink-0 w-auto">
              {/* First column content */}
              <img
                src={thumbnailUrl || ""}
                className="max-h-40 max-w-[160px]"
              />
            </div>
            <div className="flex-grow overflow-hidden">
              {/* Second column content */}
              <div className="flex flex-col">
                {isOpen ? (
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white ">
                    {"Title:"}
                  </h4>
                ) : (
                  <></>
                )}
                <h5
                  className={cn(
                    "mb-2 text-2xl font-normal tracking-tight text-gray-900 dark:text-white break-words",
                    { "line-clamp-2 font-bold": !isOpen }
                  )}
                >
                  {title}
                </h5>
                {isOpen ? (
                  <h4 className=" text-lg font-bold text-gray-800 dark:text-gray-300">
                    {"Description:"}
                  </h4>
                ) : (
                  <></>
                )}
                <div
                  className={cn(
                    "font-normal text-gray-700 dark:text-gray-400",
                    { "line-clamp-5": !isOpen }
                  )}
                >
                  {description}
                </div>
                {isOpen ? (
                  <>
                    <div className="space-y-2 mt-2">
                      <div>
                        <span className="font-bold text-gray-800 dark:text-gray-300 ">
                          {"Privacy status: "}
                        </span>
                        <span className="font-bold text-gray-700 dark:text-gray-400">
                          {privacyStatus}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="font-bold text-gray-800 dark:text-gray-300">
                          {"Tags: "}
                        </div>
                        <div className="w-full bg-slate-400 dark:bg-black rounded-lg dark:border-slate-700 border-2 p-2 ml-1">
                          {tags.map((tag) => {
                            return (
                              <>
                                <span className="p-1 rounded dark:bg-gray-400 text-gray-700 dark:text-gray-900">
                                  {tag}
                                </span>
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 dark:text-gray-300">
                          {`Category: `}
                        </span>
                        <span className="font-bold text-gray-700 dark:text-gray-400">
                          {categoryId}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 dark:text-gray-300">
                          {"Size: "}
                        </span>
                        <span className="font-bold text-gray-700 dark:text-gray-400">
                          {videoFileSize}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 dark:text-gray-300">
                          {"Video format: "}
                        </span>
                        <span className="font-bold text-gray-700 dark:text-gray-400">
                          {videoType}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 w-auto  ml-auto">
              {/* Third column content */}
              <div className="flex flex-col gap-2 justify-end">
                <Button
                  radius="full"
                  onClick={handleEdit}
                  isDisabled={isPublishingState}
                  className={cn(
                    "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg",
                    { "hidden ": !isEditable }
                  )}
                >
                  Edit
                </Button>
                <Button
                  radius="full"
                  isDisabled={
                    roleInRoomState === Role.EDITOR &&
                    ownersInCurrentRoomState! > 1 &&
                    !!sentForApproval
                  }
                  className={cn(
                    "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg",
                    {
                      "hidden ": !(
                        ownersInCurrentRoomState! > 1 && !sentForApproval
                      ),
                    }
                  )}
                  onClick={handleSendForApproval}
                >
                  {roleInRoomState === Role.EDITOR &&
                  ownersInCurrentRoomState! > 1 &&
                  !!sentForApproval ? (
                    <>
                      <div className="flex items-center gap-4 justify-between">
                        <div>Sent for approval</div>
                        <div>
                          <DoneRoundedIcon></DoneRoundedIcon>
                        </div>
                      </div>
                    </>
                  ) : (
                    "Send for approval"
                  )}
                </Button>
                <Button
                  radius="full"
                  isDisabled={
                    !(
                      ownersInCurrentRoomState! > 1 &&
                      !isApproved &&
                      _count.approvedByOwners === 0
                    )
                  }
                  className={cn(
                    "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg",
                    {
                      "hidden ": ownersInCurrentRoomState === 1 || isApproved,
                    }
                  )}
                  onClick={handleApprove}
                >
                  {!(
                    ownersInCurrentRoomState! > 1 &&
                    !isApproved &&
                    _count.approvedByOwners === 0
                  ) ? (
                    <div className="flex items-center gap-4 justify-between">
                      <div>{"Approved"}</div>
                      <div>
                        <DoneRoundedIcon></DoneRoundedIcon>
                      </div>
                    </div>
                  ) : (
                    "Approve"
                  )}
                </Button>
                <Button
                  radius="full"
                  className={cn(
                    "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg",
                    {
                      "hidden ": roleInRoomState === Role.EDITOR || !isApproved,
                    }
                  )}
                  onClick={handlePublish}
                >
                  {isEditable ? "Publish" : "Publishing"}
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0 w-auto  ml-auto">
              <ChevronDownIcon
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  {
                    "transform rotate-180": isOpen,
                  }
                )}
              />
            </div>
          </div>
        </div>
      </FullWidthBg>
    </>
  );
}
