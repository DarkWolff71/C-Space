import { Sidebar } from "@/components/ui";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar></Sidebar>
      {children}
    </>
  );
}
