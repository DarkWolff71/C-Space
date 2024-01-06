"use client";

import Link from "next/link";
import React from "react";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import AppsIcon from "@mui/icons-material/Apps";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import OutboxRoundedIcon from "@mui/icons-material/OutboxRounded";
import MoveToInboxRoundedIcon from "@mui/icons-material/MoveToInboxRounded";
import { Avatar, Button } from "@nextui-org/react";
import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./shadcn/sheet";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "./shadcn/use-toast";

export function Sidebar() {
  const { data: session } = useSession();
  const { toast } = useToast();

  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-[16.65%] h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Sheet>
                <SheetTrigger className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full">
                  <Avatar src={session?.user.image ?? ""} size="md" />
                  <span className="ms-3">{session?.user.name}</span>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    {/* <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                    <SheetDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </SheetDescription> */}
                    <div className="mt-5">
                      <Button className="w-full" onClick={() => signOut()}>
                        Signout
                      </Button>
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </li>
            <li>
              <Link
                href="rooms"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <AppsIcon className="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></AppsIcon>
                <span className="flex-1 ms-3">Rooms</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  if (!session?.user.roomName) {
                    toast({
                      className: "text-warning-400",
                      description: "Please select a room!!",
                    });
                  }
                }}
                href="members"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <PeopleAltSharpIcon className="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></PeopleAltSharpIcon>
                <span className="flex-1 ms-3 ">Members</span>
              </Link>
            </li>
            {/* <li>
              <Link
                href="chats"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <MessagesSquare className="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></MessagesSquare>
                <span className="flex-1 ms-3 whitespace-nowrap">Chats</span>
              </Link>
            </li> */}
            <li>
              <Link
                onClick={() => {
                  if (!session?.user.roomName) {
                    toast({
                      className: "text-warning-400",
                      description: "Please select a room!!",
                    });
                  }
                }}
                href="upload-video"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <OndemandVideoIcon className="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></OndemandVideoIcon>
                <span className="flex-1 ms-3">Upload video</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  if (!session?.user.roomName) {
                    toast({
                      className: "text-warning-400",
                      description: "Please select a room!!",
                    });
                  }
                }}
                prefetch={false}
                href="unpublished-videos"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <VideoLibraryIcon className="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></VideoLibraryIcon>
                <span className="flex-1 ms-3">Unpublished videos</span>
              </Link>
            </li>

            <li>
              <Link
                onClick={() => {
                  if (!session?.user.roomName) {
                    toast({
                      className: "text-warning-400",
                      description: "Please select a room!!",
                    });
                  }
                }}
                prefetch={false}
                href="received-requests"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <MoveToInboxRoundedIcon className="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></MoveToInboxRoundedIcon>

                <span className="flex-1 ms-3">Received Requests</span>
              </Link>
            </li>
            {session?.user.role === "owner" ? (
              <li>
                <Link
                  prefetch={false}
                  href="/sent-requests"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group "
                >
                  <OutboxRoundedIcon className="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"></OutboxRoundedIcon>

                  <span className="flex-1 ms-3">Sent Requests</span>
                </Link>
              </li>
            ) : null}
            {session?.user.role === "owner" ? (
              <li>
                <Link
                  prefetch={false}
                  href="approval-pending-requests"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <HourglassTopRoundedIcon
                    fontSize="medium"
                    className="p-0 m-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  ></HourglassTopRoundedIcon>
                  <span className="flex-1 ms-3">Approval Pending Requests</span>
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      </aside>
    </>
  );
}
