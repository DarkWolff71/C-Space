import React from "react";
import { FullWidthBg, PageContent } from "./";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { Separator } from "@/components/ui/shadcn/separator";
import { Button } from "@nextui-org/react";

type Props = {
  className?: string;
  id?: string;
  roomName: string;
  toUser: string;
  role: string;
  showCreatorsList: boolean;
  showOwnersList: boolean;
};

export function JoinRequest({
  className,
  id,
  roomName,
  toUser,
  role,
  showCreatorsList,
  showOwnersList,
}: Props) {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  const tags = Array.from({ length: 2 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  );

  return (
    <>
      <PageContent title={"Requests"}>
        <FullWidthBg className="p-4 ">
          <Accordion
            type="single"
            collapsible
            className="w-full bg-black px-3 py-0.5 rounded-md"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="hover:no-underline ">
                <div className=" flex justify-between items-center w-full">
                  <div>
                    The owners of <span className="font-bold">{roomName}</span>{" "}
                    requested you to join their room as{" "}
                    <span className="italic font-bold"> {role}</span>
                  </div>
                  <div className="space-x-4 mx-4">
                    <Button
                      color="primary"
                      className="bg-blue-600 dark:text-white"
                    >
                      Accept
                    </Button>
                    <Button color="primary">Reject</Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="">
                  <div className="flex gap-6 pl-10">
                    <div className="flex flex-col gap-4">
                      <p>
                        <span className="font-bold">Owners: </span>
                        <span>4</span>{" "}
                      </p>

                      <p>
                        <span className="font-bold">Editors: </span>
                        <span>4</span>{" "}
                      </p>
                    </div>
                    <div className="flex gap-6 pl-5">
                      <ScrollArea className="max-h-72 w-48 rounded-md border">
                        <div className="p-4">
                          <h4 className="mb-4 text-sm font-bold leading-none flex justify-center">
                            Owners
                          </h4>
                          {tags.map((tag) => (
                            <>
                              <div key={tag} className="text-sm">
                                {tag}
                              </div>
                              <Separator className="my-2" />
                            </>
                          ))}
                        </div>
                      </ScrollArea>
                      <ScrollArea className="max-h-72 w-48 rounded-md border">
                        <div className="p-4">
                          <h4 className="mb-4 text-sm font-bold leading-none flex justify-center">
                            Editors
                          </h4>
                          {tags.map((tag) => (
                            <>
                              <div key={tag} className="text-sm">
                                {tag}
                              </div>
                              <Separator className="my-2" />
                            </>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FullWidthBg>
      </PageContent>
    </>
  );
}
