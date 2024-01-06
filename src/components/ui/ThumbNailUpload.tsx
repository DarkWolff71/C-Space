"use client";

import React, { useState, type ChangeEvent, type DragEvent } from "react";
import { cn } from "@/lib/utils";
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
import {
  isThumbnailAlreadyPresent,
  isThumbnailFileChanged,
  thumbnailFile,
  thumbnailFileUrl,
} from "@/recoil-store/atoms/upload-video";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

type Props = {
  className?: string;
  id?: string;
  supportedTypes?: string;
  acceptedFileFormats?: string[];
};

export function ThumbnailUpload({
  className,
  id,
  supportedTypes,
  acceptedFileFormats,
}: Props) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  let [thumbnailFileState, setThumbnailFileState] =
    useRecoilState(thumbnailFile);
  let [thumbnailFileUrlState, setThumbnailFileUrlState] =
    useRecoilState(thumbnailFileUrl);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  let setIsThumbnailFileChangedState = useSetRecoilState(
    isThumbnailFileChanged
  );
  let isThumbnailAlreadyPresentState = useRecoilValue(
    isThumbnailAlreadyPresent
  );

  const {
    isOpen: isRemoveFileModalOpen,
    onOpen: onRemoveFileModalOpen,
    onOpenChange: onRemoveFileModalOpenChange,
  } = useDisclosure();

  const handleDrag = (e: DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];

    if (file) {
      setThumbnailFileState(file);
      setIsThumbnailFileChangedState(true);
      setThumbnailFileUrlState("");
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setSelectedFile(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setThumbnailFileState(null);
    if (isThumbnailAlreadyPresentState) {
      setIsThumbnailFileChangedState(true);
    } else {
      setIsThumbnailFileChangedState(false);
    }
    setThumbnailFileUrlState("");
  };

  return (
    <>
      {thumbnailFileState || thumbnailFileUrlState ? (
        <>
          <Modal
            isOpen={isRemoveFileModalOpen}
            onOpenChange={onRemoveFileModalOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 items-center">
                    Remove thumbnail
                  </ModalHeader>
                  <ModalBody>
                    <p>Are you sure you want to remove the thumbnail?</p>
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
          <div className="flex items-center gap-3 ">
            <img
              className={cn("flex-1 rounded  max-w-[88%]", className)}
              src={selectedFile || thumbnailFileUrlState}
              alt="Preview"
            />
            <div className="flex-shrink-0 ">
              <button
                className="text-gray-500 hover:text-white mr-1"
                onClick={onRemoveFileModalOpen}
              >
                <HighlightOffRoundedIcon></HighlightOffRoundedIcon>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full" id={id}>
          <label
            htmlFor="dropzone-for-thumbnail"
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
              id="dropzone-for-thumbnail"
              type="file"
              className="hidden"
              accept={acceptedFileFormats?.join(", ")}
              multiple={false}
              onChange={handleChange}
            />
          </label>
        </div>
      )}
    </>
  );
}
