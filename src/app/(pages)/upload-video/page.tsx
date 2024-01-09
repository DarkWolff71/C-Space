"use client";

import {
  CategoryListDropdown,
  FullWidthBg,
  PageContent,
  FileUpload,
  PrivacyStatusDropDown,
  ThumbnailUpload,
} from "@/components/ui";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { cn } from "../../../lib/utils";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  categoryIdState,
  isThumbnailFileChanged,
  isVideoFileChanged,
  privacyStatusState,
  thumbnailFile,
  videoDescription,
  videoFile,
  videoId,
  videoTags,
  videoTitle,
  videoUploadPercentage,
} from "@/recoil-store/atoms/upload-video";
import { toast } from "@/components/ui/shadcn/use-toast";
import { CreateUploadVideoRequestBodyType } from "@/validators/uploadVideoValidators";
import { useRouter } from "next/navigation";

const supportedVideoFormats = [
  ".mov",
  ".mpeg",
  ".mpg",
  ".mp4",
  ".avi",
  ".wmv",
  ".mpegps",
  ".flv",
  ".3gpp",
  ".webm",
  ".dnxhr",
  ".prores",
  ".cineform",
  ".hevc",
];
const supportedThumbnailFormats = [".jpg", ".jpeg", ".png"];

export default function Videos() {
  let titleInputRef = useRef<HTMLTextAreaElement | null>(null);
  let descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);
  let tagsInputRef = useRef<HTMLTextAreaElement | null>(null);
  let [tagsInputWarning, setTagsInputWarning] = useState<boolean>(false);
  let privacyStatus = useRecoilValue(privacyStatusState);
  let category = useRecoilValue(categoryIdState);
  let tagsState = useRecoilValue(videoTags);
  let titleState = useRecoilValue(videoTitle);
  let descriptionState = useRecoilValue(videoDescription);
  let isVideoFileChangedState = useRecoilValue(isVideoFileChanged);
  let videoIdState = useRecoilValue(videoId);
  let videoFileState = useRecoilValue(videoFile);
  let isThumbnailFileChangedState = useRecoilValue(isThumbnailFileChanged);
  let thumbnailFileState = useRecoilValue(thumbnailFile);
  let [videoUploadedPercentage, setVideoUploadedPercentage] = useRecoilState(
    videoUploadPercentage
  );
  const router = useRouter();

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.value = titleState;
    }
    if (descriptionInputRef.current) {
      descriptionInputRef.current.value = descriptionState;
    }
    if (tagsInputRef.current) {
      tagsInputRef.current.value = tagsState.join(", ");
    }
  }, [tagsState, titleState, descriptionState]);

  let handleSaveToPublishedVideos = async () => {
    let tagsArr: string[] = [];
    if (tagsInputRef.current?.value) {
      try {
        setTagsInputWarning(false);
        tagsArr = tagsInputRef.current.value
          .split(",")
          .map((tag) => tag.trim());
      } catch {
        setTagsInputWarning(true);
      }
    }
    let createUploadRequestBody: CreateUploadVideoRequestBodyType = {
      title: titleInputRef.current?.value,
      description: descriptionInputRef.current?.value,
      tags: tagsArr,
      privacyStatus: privacyStatus,
      categoryId: category,
      videoFileChanged: isVideoFileChangedState,
      ...(videoIdState && { videoId: videoIdState }),
      ...(videoFileState &&
        isVideoFileChangedState && {
          videoFile: {
            name: videoFileState.name,
            size: videoFileState.size,
            type: videoFileState.type,
          },
        }),
      thumbnailFileChanged: isThumbnailFileChangedState,
      ...(thumbnailFileState &&
        isThumbnailFileChangedState && {
          thumbnailFile: {
            name: thumbnailFileState.name,
            size: thumbnailFileState.size,
            type: thumbnailFileState.type,
          },
        }),
    };
    let createUploadVideoResponse = await axios.post(
      "/api/create-upload-video",
      createUploadRequestBody
    );

    if (
      createUploadVideoResponse.data.thumbnailPresignedUrl &&
      thumbnailFileState
    ) {
      const presignedUrl = createUploadVideoResponse.data.thumbnailPresignedUrl;
      axios.put(presignedUrl, thumbnailFileState);
    }

    if (createUploadVideoResponse.data.partSignedUrlList) {
      let partSignedUrlList: {
        signedUrl: string;
        PartNumber: number;
      }[] = createUploadVideoResponse.data.partSignedUrlList;

      let uploadPercentagePartsArr = new Array(
        partSignedUrlList.length + 2
      ).fill(0);
      let partInfoList: {
        PartNumber: number;
        ETag: string;
      }[] = [];
      let uploadFuncPromList = [];
      for (let i = 0; i < partSignedUrlList.length; i++) {
        let partNumber = partSignedUrlList[i].PartNumber;
        let url = partSignedUrlList[i].signedUrl;
        let startByte =
          (partNumber - 1) *
          ((videoFileState?.size ?? 0) / partSignedUrlList.length);
        let endByte = Math.min(
          partNumber * ((videoFileState?.size ?? 0) / partSignedUrlList.length),
          videoFileState?.size ?? 0
        );
        let part = videoFileState?.slice(startByte, endByte);

        let uploadFuncProm = async () => {
          let partResponse = await axios.put(url, part, {
            headers: {
              "Content-Type": "application/octet-stream",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
              );
              uploadPercentagePartsArr[partNumber] = percentCompleted;
            },
          });

          let partInfo = {
            PartNumber: partNumber,
            //@ts-ignore
            ETag: partResponse.headers?.get("ETag")?.replace(/"/g, "") ?? "",
          };
          partInfoList.push(partInfo);
        };
        uploadFuncPromList.push(uploadFuncProm);
      }
      let uploadFuncExecPromList = uploadFuncPromList.map((x) => x());
      let setIntervalId = setInterval(() => {
        const sum = Math.round(
          (uploadPercentagePartsArr.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          ) *
            100) /
            (partSignedUrlList.length * 100)
        );
        if (videoUploadedPercentage != sum) {
          setVideoUploadedPercentage(sum);
        }
      }, 1000);

      await Promise.all(uploadFuncExecPromList);
      setVideoUploadedPercentage(100);
      clearInterval(setIntervalId);

      await axios.post("http://localhost:3000/api/complete-upload-video", {
        fileKey: createUploadVideoResponse.data.key,
        uploadId: createUploadVideoResponse.data.uploadId,
        parts: partInfoList,
      });
    }
    router.refresh();
    toast({
      description: "Successfully saved to unpublished videos!!",
    });
  };
  return (
    <>
      <PageContent title="Videos">
        <div className="flex flex-col">
          <FullWidthBg>
            <p className="text-2xl font-medium text-gray-900 dark:text-gray-200 flex justify-center">
              Upload a video
            </p>
            <FileUpload
              acceptedFileFormats={supportedVideoFormats}
              className="m-2"
            ></FileUpload>
          </FullWidthBg>
          <div className="grid  grid-cols-[3fr,2fr] mt-4 space-x-4">
            <div className="flex flex-col">
              <FullWidthBg className="p-3">
                <label
                  htmlFor="video-title"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-200"
                >
                  Title:
                </label>
                <textarea
                  id="video-title"
                  rows={1}
                  ref={titleInputRef}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your video's title goes here..."
                ></textarea>
              </FullWidthBg>
              <FullWidthBg className="mt-4 p-3 flex-1 flex flex-col">
                <label
                  htmlFor="video-description"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-200"
                >
                  Description:
                </label>
                <textarea
                  id="video-description"
                  ref={descriptionInputRef}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex-1"
                  placeholder="Your video's description goes here..."
                ></textarea>
              </FullWidthBg>
            </div>
            <div>
              <FullWidthBg className="h-full p-3">
                <label
                  htmlFor="video-description"
                  className="block text-lg font-medium text-gray-900 dark:text-gray-200 px-1"
                >
                  Upload a thumbnail:
                </label>
                <ThumbnailUpload
                  className={`m-2 max-h-[26vh]`}
                  supportedTypes="JPG or PNG (MAX. 2MB)"
                  acceptedFileFormats={supportedThumbnailFormats}
                ></ThumbnailUpload>
              </FullWidthBg>
            </div>
          </div>
          <div className="grid grid-cols-[3fr,2fr] mt-4 space-x-4">
            <div>
              <FullWidthBg className="p-3">
                <label
                  htmlFor="video-tags"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-200"
                >
                  Tags:
                </label>
                <textarea
                  id="video-tags"
                  rows={4}
                  ref={tagsInputRef}
                  className={cn(
                    "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ",
                    {
                      "border-red-700 ring-red-700 dark:ring-red-700 dark:border-red-700 ring-2":
                        tagsInputWarning,
                    }
                  )}
                  placeholder={
                    "Your video's descriptiontags goes here as a comma separated list... \nEx: Santa Cruz, surfing, adventure"
                  }
                ></textarea>
              </FullWidthBg>
            </div>
            <div className="space-y-4 full-h">
              <FullWidthBg className="p-4">
                <div className="flex flex-row justify-between items-center ">
                  <label
                    htmlFor="video-category"
                    className="block text-lg font-medium text-gray-900 dark:text-gray-200 w-full"
                  >
                    Category:
                  </label>
                  <div className="flex justify-center w-full">
                    <CategoryListDropdown></CategoryListDropdown>
                  </div>
                </div>
              </FullWidthBg>
              <FullWidthBg className="p-4">
                <div className="flex flex-row items-center ">
                  <label
                    htmlFor="video-privacy-status"
                    className="block text-lg font-medium text-gray-900 dark:text-gray-200 w-full"
                  >
                    Privacy status:
                  </label>
                  <div className="flex justify-center w-full">
                    <PrivacyStatusDropDown></PrivacyStatusDropDown>
                  </div>
                </div>
              </FullWidthBg>
            </div>
          </div>
          <div className="flex flex-row items-center justify-around mt-4">
            <Button
              radius="full"
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
              onPress={handleSaveToPublishedVideos}
            >
              Save to unpublished videos
            </Button>
          </div>
        </div>
      </PageContent>
    </>
  );
}
