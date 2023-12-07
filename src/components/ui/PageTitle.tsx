import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function PageTitle({ children }: Props) {
  return (
    <>
      <h1 className="mt-4 flex items-center justify-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-gray-200">
        {"~ "}{children}{" ~"}
      </h1>
    </>
  );
}
