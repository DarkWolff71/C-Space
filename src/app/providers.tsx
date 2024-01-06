"use client";

import { NextUIProvider } from "@nextui-org/react";
import { RecoilRoot } from "recoil";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <SessionProvider>
        <RecoilRoot>{children}</RecoilRoot>
      </SessionProvider>
    </NextUIProvider>
  );
}
