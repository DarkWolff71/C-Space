import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/shadcn/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "C-Space",
  description: "A collaborative space for YouTube video editors and owners.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark dark:dark">
      {/* <html lang="en" className="dark"> */}
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
