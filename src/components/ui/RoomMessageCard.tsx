import React, { MouseEventHandler } from "react";
type Props = {
  roomName: string;
  message?: string;
  onClickHandler?: MouseEventHandler<HTMLAnchorElement>;
};
export function RoomMessageCard({ roomName, message, onClickHandler }: Props) {
  return (
    <>
      <a
        onClick={onClickHandler}
        className="block max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-black dark:border-gray-700 dark:hover:bg-gray-700  min-w-[250px]"
      >
        <div>
          <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white break-words flex justify-center">
            {roomName}
          </p>
        </div>
        <div>
          <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-1">
            {message}
          </p>
        </div>
      </a>
    </>
  );
}
