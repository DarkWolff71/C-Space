import React, { MouseEventHandler } from "react";
import { Avatar } from "@nextui-org/react";

type Props = {
  name: string;
  message?: string;
  onClickHandler?: MouseEventHandler<HTMLAnchorElement>;
  avatarLink?: string;
};

export function MemberCard({
  name,
  message,
  onClickHandler,
  avatarLink,
}: Props) {
  return (
    <>
      <a
        href="#"
        onClick={onClickHandler}
        className="block max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-black dark:border-gray-700 dark:hover:bg-gray-700  min-w-[250px]"
      >
        <div className="grid grid-cols-6">
          <div className="col-span-5 pr-5">
            <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white break-words">
              {name}
            </p>
          </div>

          <div className="col-span-1">
            <Avatar
              isBordered
              color="success"
              src="https://i.pravatar.cc/150?u=a04258114e29026302d"
              size="sm"
            />
          </div>
        </div>
        <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-1">
          {message}
        </p>
      </a>
    </>
  );
}
