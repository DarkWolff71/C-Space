import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function PageTitle({ children }: Props) {
  return (
    <>
      <h1 className="flex items-center justify-center mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-gray-900 dark:text-white">
        {"~ "}
        {children}
        {" ~"}
      </h1>
    </>
  );
}
