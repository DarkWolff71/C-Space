"use client";

import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useSetRecoilState } from "recoil";
import { Role } from "@/lib/constants/roles";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import axios from "axios";
import Cookies from "js-cookie";

import { useRouter } from "next/navigation";
import { toast } from "./shadcn/use-toast";
import {
  categoryIdState,
  isThumbnailAlreadyPresent,
  isThumbnailFileChanged,
  isVideoAlreadyPresent,
  isVideoFileChanged,
  privacyStatusState,
  thumbnailFile,
  thumbnailFileUrl,
  videoDescription,
  videoFile,
  videoFileSize,
  videoFileType,
  videoId,
  videoTags,
  videoTitle,
  videoUploadPercentage,
} from "@/recoil-store/atoms/upload-video";
import { ScrollArea } from "./shadcn/scroll-area";
import { Separator } from "./shadcn/separator";
import { FullWidthBg } from ".";
import { BASE_URL } from "@/lib/config/URL";

type Props = {
  id: string;
  title: string | null;
  description: string | null;
  tags: string[];
  videoType: string | null;
  videoFileSize: number | null;
  videoFileName: string | null;
  thumbnailSize: number | null;
  thumbnailType: string | null;
  thumbnailUrl?: string | null;
  privacyStatus: "private" | "public" | "unlisted";
  categoryId: string | null;
  isEditable: boolean;
  sentForApproval: boolean | null;
  isApproved: boolean;
  _count: {
    approvedByOwners: number;
  };
  approvedByOwners: {
    name: string;
    email: string;
  }[];
  owners: {
    name: string;
    email: string;
  }[];
  ownersInCurrentRoom: number;
  roleInCurrentRoom: Role;
};

function getVideoFileSize(bytes: number): string {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  if (bytes < kilobyte) {
    return bytes + " Bytes";
  } else if (bytes < megabyte) {
    return (bytes / kilobyte).toFixed(2) + " KB";
  } else if (bytes < gigabyte) {
    return (bytes / megabyte).toFixed(2) + " MB";
  } else {
    return (bytes / gigabyte).toFixed(2) + " GB";
  }
}

export function UnpublishedVideoCard({
  id,
  title,
  description,
  tags,
  thumbnailUrl,
  thumbnailSize,
  thumbnailType,
  videoType,
  videoFileSize: videoSize,
  videoFileName,
  privacyStatus,
  categoryId,
  isEditable,
  sentForApproval,
  isApproved,
  approvedByOwners,
  owners,
  _count,
  ownersInCurrentRoom,
  roleInCurrentRoom,
}: Props) {
  let [isOpen, setIsOpen] = useState<boolean>(false);
  let [isPublishingState, setIsPusblishingState] = useState(false);
  let [isPublishedState, setIsPublishedState] = useState(false);

  let setvideoTagsState = useSetRecoilState(videoTags);
  let setvideoIdState = useSetRecoilState(videoId);
  let setvideoFileState = useSetRecoilState(videoFile);
  let setVideoFileTypeState = useSetRecoilState(videoFileType);
  let setVideoFileSizeState = useSetRecoilState(videoFileSize);
  let setIsVideoFileChangedState = useSetRecoilState(isVideoFileChanged);
  let setThumbnailFileState = useSetRecoilState(thumbnailFile);
  let setThumbnailFileUrlState = useSetRecoilState(thumbnailFileUrl);
  let setIsThumbnailFileChangedState = useSetRecoilState(
    isThumbnailFileChanged
  );
  let setIsThumbnailAlreadyPresentState = useSetRecoilState(
    isThumbnailAlreadyPresent
  );
  let setIsVideoAlreadyPresentState = useSetRecoilState(isVideoAlreadyPresent);
  let setvideoUploadPercentageState = useSetRecoilState(videoUploadPercentage);
  let setvideoTitleState = useSetRecoilState(videoTitle);
  let setvideoDescriptionState = useSetRecoilState(videoDescription);
  let setprivacyStatusState = useSetRecoilState(privacyStatusState);
  let setcategoryIdState = useSetRecoilState(categoryIdState);
  const router = useRouter();

  function handleApprove(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    axios.post(`${BASE_URL}/api/approve-video`, {
      videoId: id,
    });
    router.refresh();
  }

  function handleSendForApproval(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    axios.post(`${BASE_URL}/api/send-video-for-approval`, {
      videoId: id,
    });
    router.refresh();
  }

  async function handleEdit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    let response = await axios.post(`${BASE_URL}/api/video-editable`, {
      videoId: id,
    });
    if (response.data.state === "editable") {
      setvideoIdState(id);
      setvideoDescriptionState(description ?? "");
      setvideoTagsState(tags ?? "");
      setvideoTitleState(title ?? "");
      setprivacyStatusState(privacyStatus);
      setcategoryIdState(categoryId ?? "");
      setIsThumbnailFileChangedState(false);
      setIsVideoFileChangedState(false);
      if (videoFileName) {
        const blob = new Blob(["Dummy file"], { type: "text/plain" });
        const dummyFile = new File([blob], videoFileName);

        setvideoFileState(dummyFile);
        setVideoFileTypeState(videoType);
        setVideoFileSizeState(videoSize);
        setvideoUploadPercentageState(100);
        setIsVideoAlreadyPresentState(true);
      } else {
        setvideoFileState(null);
        setIsVideoAlreadyPresentState(false);
        setvideoUploadPercentageState(0);
        setVideoFileTypeState(null);
        setVideoFileSizeState(null);
      }
      if (thumbnailUrl) {
        const blob = new Blob(["Dummy file"], { type: "text/plain" });
        const dummyFile = new File([blob], response.data.videoFileName);
        setThumbnailFileState(dummyFile);
        setThumbnailFileUrlState(thumbnailUrl);
        setIsThumbnailAlreadyPresentState(true);
      } else {
        setThumbnailFileState(null);
        setThumbnailFileUrlState("");
        setIsThumbnailAlreadyPresentState(false);
      }
      router.push("/upload-video");
    } else {
      router.refresh();
    }
  }

  async function handlePublish(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    setIsPusblishingState(true);
    const ytTokenCookie = Cookies.get("yt-token");
    if (ytTokenCookie) {
      await axios.post(`${BASE_URL}/api/publish-video`, {
        videoId: id,
        ytToken: JSON.parse(decodeURIComponent(ytTokenCookie)),
      });
      setIsPublishedState(true);
      toast({
        description: "Successfully published to Youtube!!",
      });
    } else {
      let response = await axios.get(`${BASE_URL}/api/get-yt-token`);
      router.push(response.data.url);
    }
    setIsPusblishingState(false);
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
                  <h4 className=" text-lg font-bold text-gray-800 dark:text-gray-300">
                    {"Title:"}
                  </h4>
                ) : (
                  <></>
                )}
                <h5
                  className={cn(
                    "font-normal text-lg text-gray-700 dark:text-gray-400 break-words tracking-tight",

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
                        {tags.length > 0 ? (
                          <div className="w-full bg-slate-400 dark:bg-black rounded-lg dark:border-slate-700 border-2 p-2 ml-1 gap-1 flex flex-wrap">
                            {tags.map((tag, index) => {
                              return (
                                <span
                                  key={index}
                                  className="p-1 rounded dark:bg-gray-400 text-gray-700 dark:text-gray-900"
                                >
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                        ) : null}
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
                          {"Video file size: "}
                        </span>
                        <span className="font-bold text-gray-700 dark:text-gray-400">
                          {videoSize ? getVideoFileSize(videoSize) : null}
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
                      <div>
                        <span className="font-bold text-gray-800 dark:text-gray-300">
                          {"Thumbnail file size: "}
                        </span>
                        <span className="font-bold text-gray-700 dark:text-gray-400">
                          {thumbnailSize
                            ? getVideoFileSize(thumbnailSize)
                            : null}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 dark:text-gray-300">
                          {"Thumbnail format: "}
                        </span>
                        <span className="font-bold text-gray-700 dark:text-gray-400">
                          {thumbnailType}
                        </span>
                      </div>
                      {!(ownersInCurrentRoom === 1 || isApproved) ? (
                        <>
                          <div className="flex space-x-5 text-gray-800 dark:text-gray-300 pt-7">
                            <div className="flex space-x-2">
                              <div className="italic"> Approved by: </div>
                              <ScrollArea className="max-h-72 w-48 rounded-md border dark:bg-black">
                                <div className="p-4">
                                  {approvedByOwners.map((user) => (
                                    <div key={user.email}>
                                      <div className="text-sm">{user.name}</div>
                                      <Separator className="my-2" />
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                            <div className="flex space-x-2">
                              <div className="italic">
                                Approval pending by:{" "}
                              </div>
                              <ScrollArea className="max-h-72 w-48 rounded-md border dark:bg-black">
                                <div className="p-4">
                                  {owners &&
                                    owners
                                      .filter(
                                        (owner) =>
                                          !approvedByOwners.some(
                                            (approvedOwner) =>
                                              approvedOwner.email ===
                                              owner.email
                                          )
                                      )
                                      .map((user) => (
                                        <div key={user.email}>
                                          <div className="text-sm">
                                            {user.name}
                                          </div>
                                          <Separator className="my-2" />
                                        </div>
                                      ))}
                                </div>
                              </ScrollArea>
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
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
                    { "hidden ": !isEditable || isPublishedState }
                  )}
                >
                  Edit
                </Button>
                <Button
                  radius="full"
                  isDisabled={
                    roleInCurrentRoom === Role.EDITOR &&
                    ownersInCurrentRoom! > 1 &&
                    !!sentForApproval
                  }
                  className={cn(
                    "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg",
                    {
                      "hidden ":
                        !(ownersInCurrentRoom! > 1 && !sentForApproval) ||
                        !videoSize,
                    }
                  )}
                  onClick={handleSendForApproval}
                >
                  {roleInCurrentRoom === Role.EDITOR &&
                  ownersInCurrentRoom > 1 &&
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
                      ownersInCurrentRoom > 1 &&
                      !isApproved &&
                      _count.approvedByOwners === 0
                    )
                  }
                  className={cn(
                    "bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg",
                    {
                      "hidden ":
                        ownersInCurrentRoom === 1 ||
                        !videoSize ||
                        isApproved ||
                        !sentForApproval,
                    }
                  )}
                  onClick={handleApprove}
                >
                  {!(
                    ownersInCurrentRoom > 1 &&
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
                      "hidden ":
                        isPublishedState ||
                        !videoSize ||
                        roleInCurrentRoom === Role.EDITOR ||
                        !isApproved,
                    }
                  )}
                  onClick={handlePublish}
                >
                  {isPublishedState
                    ? "Published"
                    : isEditable && !isPublishingState
                    ? "Publish"
                    : "Publishing"}
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
