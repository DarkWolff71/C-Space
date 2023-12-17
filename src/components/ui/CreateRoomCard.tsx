"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AddIcon from "@mui/icons-material/Add";

type Props = {
  className?: string;
};

let handleClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {};

export function CreateRoomCard({ className }: Props) {
  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer h-[15%] font-normal text-gray-700 dark:text-gray-400",
          className
        )}
      >
        <div className="h-full w-full flex items-center justify-center flex-col">
          <div>
            <AddIcon fontSize="large"></AddIcon>
          </div>
          <p>{"Create a new room"}</p>
        </div>
      </div>
    </>
  );
}
