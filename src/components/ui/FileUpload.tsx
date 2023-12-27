"use client";

import React, { useState, type ChangeEvent, type DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@nextui-org/react";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isVideoFileChanged,
  videoFile,
} from "@/recoil-store/atoms/upload-video";

type Props = {
  className?: string;
  id?: string;
  supportedTypes?: string;
  acceptedFileFormats?: string[];
};

export function FileUpload({
  className,
  id,
  supportedTypes,
  acceptedFileFormats,
}: Props) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const {
    isOpen: isRemoveFileModalOpen,
    onOpen: onRemoveFileModalOpen,
    onOpenChange: onRemoveFileModalOpenChange,
  } = useDisclosure();

  let [fileState, setFileState] = useRecoilState(videoFile);
  let [videoUploadedPercentage, setVideoUploadedPercentage] = useState(0);
  let setIsVideoFileChangedState = useSetRecoilState(isVideoFileChanged);

  function convertBytes(bytes: number): string {
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

  const handleDrag = (e: DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFileState(file);
      setIsVideoFileChangedState(true);
    }
    console.log(file);
  };

  const handleRemoveFile = () => {
    setFileState(null);
    setIsVideoFileChangedState(true);
    setVideoUploadedPercentage(0);
  };

  return (
    <>
      {!!fileState ? (
        <>
          <Modal
            isOpen={isRemoveFileModalOpen}
            onOpenChange={onRemoveFileModalOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 items-center">
                    Remove video
                  </ModalHeader>
                  <ModalBody>
                    <p>Are you sure you want to remove the video?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onPress={(e) => {
                        handleRemoveFile();
                        onClose();
                      }}
                    >
                      Yes, continue
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <div className="m-2 dark:bg-black rounded-lg border-1 border-gray-500 grid grid-cols-[repeat(4,auto)_min-content]  ">
            <div className="dark:text-gray-400 font-bold px-4 py-2 max-w-[60vh]">
              <h3>Name</h3>
            </div>
            <div className="dark:text-gray-400 font-bold px-4 py-2">
              <h3>Size</h3>
            </div>
            <div className="dark:text-gray-400 font-bold px-4 py-2">
              <h3>Format</h3>
            </div>
            <div className="dark:text-gray-400 font-bold px-4 py-2">
              <h3>Status</h3>
            </div>
            <div></div>
            <div className="col-span-5 max-h-[0.5px] border-gray-500 border-1"></div>
            <div className=" flex items-center p-4 py-6 max-w-[60vh]">
              <p className="break-words text-ellipsis overflow-hidden">
                {fileState?.name}
              </p>
            </div>
            <div className=" flex items-center p-4 py-6">
              <p>{convertBytes(fileState?.size ?? 0)}</p>
            </div>
            <div className=" flex items-center p-4 py-6">
              <p>{fileState?.type}</p>
            </div>
            <div className=" flex items-center p-4 py-6">
              {videoUploadedPercentage === 0 ? (
                <div>
                  <p>Not uploaded</p>
                  <p className="text-xs">{`(save to upload)`}</p>
                </div>
              ) : (
                <Progress
                  size="md"
                  radius="sm"
                  classNames={{
                    base: "max-w-md",
                    track: "drop-shadow-md border border-default",
                    indicator: "bg-gradient-to-r from-gray-800 to-gray-100",
                    label: "tracking-wider font-medium text-default-600",
                    value: "text-foreground/60",
                  }}
                  label={100 ? "Uploading" : "Uploaded"}
                  value={65}
                  showValueLabel={true}
                />
              )}
            </div>
            <div className="flex items-center max-w-fit  pr-2">
              <button
                className="text-gray-500 hover:text-white"
                onClick={onRemoveFileModalOpen}
              >
                <HighlightOffRoundedIcon></HighlightOffRoundedIcon>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center w-full" id={id}>
            <label
              htmlFor="dropzone-file"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              className={cn(
                "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
                {
                  "hover:bg-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600":
                    dragActive,
                },
                className
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {supportedTypes}
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept={acceptedFileFormats?.join(", ")}
                multiple={false}
                onChange={handleFileChange}
              />
            </label>
          </div>
        </>
      )}
    </>
  );
}
