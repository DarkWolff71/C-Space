import React, { useState } from "react";
import { FullWidthBg } from ".";
import { Avatar } from "@nextui-org/react";
import { Separator } from "@radix-ui/react-separator";

enum Role {
  OWNER,
  EDITOR,
}

type Props = {
  members: { name: string; image: string }[];
  role: Role;
};

export function RoomMembersByRole({ members, role }: Props) {
  let [filteredMembersList, setFilteredMembersList] = useState(members);

  let [searchInputValue, setSearchInputValue] = useState<string>("");
  let inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    setSearchInputValue(inputValue);
    if (inputValue) {
      console.log(inputValue);
      setFilteredMembersList(
        members.filter((member) => member.name.startsWith(inputValue.trim()))
      );
    } else {
      setFilteredMembersList(members);
    }
  };
  return (
    <>
      <FullWidthBg className="w-full p-2">
        <p className="text-2xl font-medium text-gray-900 dark:text-gray-200 flex justify-center mb-2">
          {role == Role.EDITOR ? "Editors" : "Owners"}
        </p>
        <input
          type="search"
          className="bg-slate-400 dark:bg-black w-[70%] rounded-lg mb-2 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700"
          placeholder={
            role == Role.EDITOR ? "Searc in editors..." : "Search owners..."
          }
          onChange={inputChangeHandler}
        ></input>
        <div className="bg-slate-400 dark:bg-black rounded-lg p-3 pt-2">
          {filteredMembersList.map((member, id) => {
            return (
              <div key={id.toString()}>
                <div className="my-2 flex justify-between items-center">
                  <div>{member.name}</div>
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
    </>
  );
}
