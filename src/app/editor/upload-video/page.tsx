"use client";

import {
  CategoryListDropdown,
  EditorSideBar,
  FullWidthBg,
  PageContent,
  FileUpload,
  PrivacyStatusDropDown,
} from "@/components/ui";
import React, { useState, useRef } from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { cn } from "../../../lib/utils";
import { useRecoilValue } from "recoil";
import {
  categoryIdState,
  privacyStatusState,
} from "@/recoil-store/atoms/upload-video";

export default function Videos() {
  let [filesPendingToBeUploaded, setFilesPendingToBeUploaded] = useState<
    number[]
  >([1]);
  let titleInputRef = useRef<HTMLTextAreaElement | null>(null);
  let descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);
  let tagsInputRef = useRef<HTMLTextAreaElement | null>(null);
  let [tagsInputWarning, setTagsInputWarning] = useState<boolean>(true);
  // TODO: the below two should be updated to recoil for avoiding re-renders
  let privacyStatus = useRecoilValue(privacyStatusState);
  let category = useRecoilValue(categoryIdState);

  let handleSave = () => {
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
    axios.post("/api/upload-video", {
      title: titleInputRef.current?.value,
      description: descriptionInputRef.current?.value,
      tags: tagsArr,
      privacyStatus: privacyStatus,
      category: category,
    });
  };

  let handleSaveToPublishedVideos = () => {
    console.log(titleInputRef.current?.value);
  };

  return (
    <>
      <EditorSideBar></EditorSideBar>
      <PageContent title="Videos">
        <div className="flex flex-col">
          <FullWidthBg>
            <p className="text-2xl font-medium text-gray-900 dark:text-gray-200 flex justify-center">
              Upload a video
            </p>
            <FileUpload
              className={`m-2 ${
                filesPendingToBeUploaded.length > 0
                  ? "max-h-[26vh]"
                  : "max-h-[26vh]"
              }`}
            ></FileUpload>
          </FullWidthBg>
          <div className="grid  grid-cols-[3fr,2fr] mt-4 space-x-4">
            <div>
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
              <FullWidthBg className="mt-4 p-3 ">
                <label
                  htmlFor="video-description"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-200"
                >
                  Description:
                </label>
                <textarea
                  id="video-description"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                <FileUpload
                  className={`m-2 ${
                    filesPendingToBeUploaded.length > 0
                      ? "max-h-[26vh]"
                      : "max-h-[26vh]"
                  }`}
                  supportedTypes="JPG or PNG (MAX. 2MB)"
                ></FileUpload>
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
              onPress={handleSave}
            >
              Save
            </Button>
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
