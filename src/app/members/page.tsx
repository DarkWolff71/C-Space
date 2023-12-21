"use client";

import { FullWidthBg, MembersSearchBar, PageContent } from "@/components/ui";
import { Separator } from "@/components/ui/shadcn/separator";
import React, { useState } from "react";
import { Avatar } from "@nextui-org/react";
import { RoomMembersByRole } from "@/components/ui/RoomMembersByRole";
import { Role } from "@/lib/roles";

export default function MemebersPage() {
  let ownersList = ["fsdfd", "fsdfds", "Fsdfs"];
  let [filteredOwnersList, setFilteredOwnersList] = useState(ownersList);

  let [searchInputValue, setSearchInputValue] = useState<string>("");
  let inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    setSearchInputValue(inputValue);
    if (inputValue) {
      console.log(inputValue);
      setFilteredOwnersList(
        ownersList.filter((owner) => owner.startsWith(inputValue.trim()))
      );
    } else {
      setFilteredOwnersList(ownersList);
    }
  };

  return (
    <>
      <PageContent title="Members">
        <div className="flex flex-col gap-4">
          <MembersSearchBar
            handleSearch={(fd: string) => console.log(fd)}
          ></MembersSearchBar>
          <div className="flex gap-10 w-full">
            <FullWidthBg className="w-full p-2">
              <p className="text-2xl font-medium text-gray-900 dark:text-gray-200 flex justify-center mb-2">
                {"Owners"}
              </p>
              <input
                type="search"
                className="bg-slate-400 dark:bg-black w-[70%] rounded-lg mb-2 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700"
                placeholder={"Search in owners..."}
                onChange={inputChangeHandler}
              ></input>
              <div className="bg-slate-400 dark:bg-black rounded-lg p-3 pt-2">
                {filteredOwnersList.map((owner, id) => {
                  return (
                    <div key={id.toString()}>
                      <div className="my-2 flex justify-between items-center">
                        <div>{owner}</div>
                        <div className="mx-2">
                          <Avatar
                            isBordered
                            radius="sm"
                            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                          />
                        </div>
                      </div>
                      <Separator />
                    </div>
                  );
                })}
              </div>
            </FullWidthBg>
            <RoomMembersByRole
              members={[
                {
                  name: "fsd",
                  image: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
                  email: "a04258a2462d826712d",
                },
              ]}
              role={Role.EDITOR}
            ></RoomMembersByRole>
          </div>
        </div>
      </PageContent>
    </>
  );
}
