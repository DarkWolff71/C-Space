import React from "react";
import { cn } from "../../lib/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
  enableHover?: boolean;
};

export function FullWidthBg({
  children,
  className,
  enableHover = false,
}: Props) {
  return (
    <>
      <div
        className={cn(
          "rounded bg-gray-50 dark:bg-gray-800 p-1 min-h-fit",
          {
            "hover:bg-gray-100 dark:hover:bg-gray-700": enableHover,
          },
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
