"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import React, { useState } from "react";
import { Separator } from "@/components/ui/shadcn/separator";
import { Avatar } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import axios from "axios";
import { GetMembersResponse } from "@/types/response";
import { useSession } from "next-auth/react";
import { FullWidthBg } from ".";
import { toast } from "./shadcn/use-toast";
import { BASE_URL } from "@/lib/config/URL";

export function MembersSearch() {
  let { data: session } = useSession();
  let [searchResults, setSearchResults] = useState<GetMembersResponse>();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onOpenChange: onModalOpenChange,
  } = useDisclosure();
  let [userName, setUserName] = useState<string>("");
  let [userEmail, setUserEmail] = useState<string>("");
  let [role, setRole] = React.useState<string>("");
  let [displayOwners, setDisplayOwners] = useState(false);
  let [displayEditors, setDisplayEditors] = useState(false);
  let [sendRequestIsLoading, setSendRequestIsLoading] = useState(false);
  let [isRequestSent, setIsRequestSent] = useState(false);
  let [showOnlyOwnersInRequestModal, setShowOnlyOwnersInRequestModal] =
    useState(false);
  let [searchInputValue, setSearchInputValue] = useState<string>("");
  let [showSearchResults, setShowSearchResults] = useState(false);

  let isSearchResultsEmpty = (): boolean => {
    return (
      (searchResults?.editorsInSameRoomAndRequestHasBeenSent?.length ?? 0) ===
        0 &&
      (searchResults?.editorsInSameRoomAndRequestHasNotBeenSent?.length ??
        0) === 0 &&
      (searchResults?.ownersInSameRoom?.length ?? 0) === 0 &&
      (searchResults?.usersInDifferentRoomsAndRequestHasBeenSent?.length ??
        0) === 0 &&
      (searchResults?.usersInDifferentRoomsAndRequestHasNotBeenSent?.length ??
        0) === 0
    );
  };

  let handleSendRequest = async () => {
    setSendRequestIsLoading(true);
    await axios.post(`${BASE_URL}/api/join-room-request/send`, {
      displayOwners,
      displayEditors,
      toUserEmail: userEmail,
      role,
    });
    let toUser = { email: "", name: "", image: "" };
    searchResults?.editorsInSameRoomAndRequestHasNotBeenSent;
    setSearchResults(
      (prevState) =>
        ({
          ...prevState,
          editorsInSameRoomAndRequestHasNotBeenSent: (
            searchResults?.editorsInSameRoomAndRequestHasNotBeenSent || []
          ).filter((user) => {
            if (user.email == userEmail) {
              toUser.email = user.email;
              toUser.image = user.image!;
              toUser.name = user.name!;
              return false;
            }
            return true;
          }),
          usersInDifferentRoomsAndRequestHasNotBeenSent: (
            searchResults?.usersInDifferentRoomsAndRequestHasNotBeenSent || []
          ).filter((user) => {
            if (user.email == userEmail) {
              toUser.email = user.email;
              toUser.image = user.image!;
              toUser.name = user.name!;
              return false;
            }
            return true;
          }),
          usersInDifferentRoomsAndRequestHasBeenSent: [
            ...(searchResults?.usersInDifferentRoomsAndRequestHasBeenSent ||
              []),
            toUser,
          ],
        } as GetMembersResponse | undefined)
    );
    toast({
      description: "Request sent.",
    });
    setIsRequestSent(true);
    setSendRequestIsLoading(false);
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  let handleSearch = async () => {
    let searchData = await getSearchResults();
    setSearchResults(searchData);
    setShowSearchResults(true);
  };

  let handleEnterKeyPress = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      await handleSearch();
    }
  };

  async function getSearchResults() {
    try {
      let response = await axios.get(`${BASE_URL}/api/get-users`, {
        params: {
          searchInput: searchInputValue.trim(),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  return (
    <>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={"Search by user-name or email address..."}
          onKeyDown={handleEnterKeyPress}
          onChange={(e) => setSearchInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={(e) => {
            handleSearch();
          }}
        >
          Search
        </button>
      </div>
      {showSearchResults ? (
        isSearchResultsEmpty() ? (
          <FullWidthBg className="flex items-center justify-center -mt-4 p-5 ">
            {"No matching results!"}
          </FullWidthBg>
        ) : (
          <>
            <Modal isOpen={isModalOpen} onOpenChange={onModalOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 pr-2 ">
                      {`Send request to ${userName} to join ${session?.user.roomName} room`}
                    </ModalHeader>
                    <ModalBody>
                      <div className="inline ">
                        <span>Ask {userName} to join the room as </span>
                        {showOnlyOwnersInRequestModal ? (
                          <span>owner.</span>
                        ) : (
                          <Select
                            placeholder="Select a role"
                            onChange={handleSelectionChange}
                            aria-label="Role"
                          >
                            <SelectItem key={"editor"} value={"editor"}>
                              {"Editor"}
                            </SelectItem>

                            <SelectItem key={"owner"} value={"owner"}>
                              {"Owner"}
                            </SelectItem>
                          </Select>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span>{"Display owners' names in the request:"}</span>
                        <Switch
                          onChange={(e) => {
                            setDisplayOwners(e.target.checked);
                          }}
                          size="sm"
                          defaultSelected={false}
                          aria-label="Display owners' names"
                          className="pl-1"
                          color="primary"
                        />
                      </div>
                      <div className="flex items-center">
                        <span>{"Display editors' names in the request:"}</span>
                        <Switch
                          onChange={(e) => {
                            setDisplayEditors(e.target.checked);
                          }}
                          size="sm"
                          defaultSelected={false}
                          aria-label="Display owners' names"
                          className="pl-1"
                          color="primary"
                        />
                      </div>
                      {session?.user.ownersInCurrentRoom &&
                      session?.user.ownersInCurrentRoom > 1 ? (
                        <p className="text-xs m-5 border-1 border-gray-600 rounded-lg p-3">
                          {
                            "As there are more than one owner for the current room, all the owners other than you for this room will receive a request to approve the joining of the user. On the approval of every owner, the request will reach the user."
                          }
                        </p>
                      ) : null}
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="primary"
                        isLoading={sendRequestIsLoading}
                        onPress={handleSendRequest}
                        isDisabled={isRequestSent || !role}
                      >
                        {isRequestSent ? (
                          <div className="flex gap-5 items-center">
                            {"Request Sent"}
                            <DoneRoundedIcon></DoneRoundedIcon>
                          </div>
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            {/*  */}
            <ScrollArea className="max-h-72 w-full rounded-md border -mt-4">
              <div className="bg-white rounded-lg shadow w-full dark:bg-gray-700 px-4">
                <ul className="text-sm text-gray-700 dark:text-gray-200">
                  {searchResults?.usersInDifferentRoomsAndRequestHasNotBeenSent?.map(
                    (user) => {
                      return (
                        <li key={user.email}>
                          <div className="inline-flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white hover:rounded-lg">
                            <div className="flex gap-4 items-center">
                              <Avatar src={user.image!} size="md" />
                              <div>{user.name}</div>
                            </div>
                            <div>
                              <Button
                                className="dark:bg-black"
                                onClick={(e) => {
                                  setIsRequestSent(false);
                                  setUserName(user.name!);
                                  setRole("");
                                  setDisplayOwners(false);
                                  setDisplayEditors(false);
                                  setShowOnlyOwnersInRequestModal(false);
                                  setUserEmail(user.email!);
                                  onModalOpen();
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                          <Separator></Separator>
                        </li>
                      );
                    }
                  )}
                  {searchResults?.editorsInSameRoomAndRequestHasNotBeenSent?.map(
                    (user) => {
                      return (
                        <li key={user.email}>
                          <div className="inline-flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white hover:rounded-lg">
                            <div className="flex gap-4 items-center">
                              <Avatar src={user.image!} size="md" />
                              <div>{user.name}</div>
                            </div>
                            <div>
                              <Button
                                className="dark:bg-black"
                                onClick={(e) => {
                                  setIsRequestSent(false);
                                  setUserName(user.name!);
                                  setRole("owner");
                                  setDisplayOwners(false);
                                  setDisplayEditors(false);
                                  setShowOnlyOwnersInRequestModal(true);
                                  setUserEmail(user.email!);
                                  onModalOpen();
                                }}
                              >
                                Make Owner
                              </Button>
                            </div>
                          </div>
                          <Separator></Separator>
                        </li>
                      );
                    }
                  )}

                  {searchResults?.ownersInSameRoom?.map((user) => {
                    return (
                      <li key={user.email}>
                        <div className="inline-flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white hover:rounded-lg">
                          <div className="flex gap-4 items-center">
                            <Avatar src={user.image!} size="md" />
                            <div>{user.name}</div>
                          </div>
                        </div>
                        <Separator></Separator>
                      </li>
                    );
                  })}
                  {[
                    ...(searchResults?.editorsInSameRoomAndRequestHasBeenSent ||
                      []),
                    ...(searchResults?.usersInDifferentRoomsAndRequestHasBeenSent ||
                      []),
                  ].map((user) => {
                    return (
                      <li key={user.email}>
                        <div className="inline-flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white hover:rounded-lg">
                          <div className="flex gap-4 items-center">
                            <Avatar src={user.image!} size="md" />
                            <div>{user.name}</div>
                          </div>
                          <div>
                            <Button
                              className="dark:bg-black flex gap-5"
                              disabled={true}
                            >
                              Request Sent
                              <DoneRoundedIcon></DoneRoundedIcon>
                            </Button>
                          </div>
                        </div>
                        <Separator></Separator>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ScrollArea>
          </>
        )
      ) : null}
    </>
  );
}
