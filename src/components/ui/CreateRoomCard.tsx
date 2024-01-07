"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import AddIcon from "@mui/icons-material/Add";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { roomNameValidator } from "@/validators/roomsValidators";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
};

export function CreateRoomCard({ className }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  let [isInvalidInput, setIsInvalidInput] = useState<boolean>(false);
  let [createRoomButtonDisabled, setCreateRoomButtonDisabled] =
    useState<boolean>(true);
  let [roomNameAlreadyExits, setRoomNameAlreadyExists] =
    useState<boolean>(false);
  let [inputErrorMessage, setInputErrorMessage] = useState<string | null>(null);
  let [inputValue, setInputValue] = useState<string>("");
  let [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const { update } = useSession();

  let handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (roomNameAlreadyExits) {
      setRoomNameAlreadyExists((currentState) => !currentState);
    }
    let parsedResult = roomNameValidator.safeParse(e.target.value);

    if (!parsedResult.success) {
      setIsInvalidInput(true);
      setCreateRoomButtonDisabled(true);
      setInputErrorMessage(parsedResult.error.issues[0].message);
    } else {
      setIsInvalidInput(false);
      setCreateRoomButtonDisabled(false);
    }
  };

  let handleCreateRoom = async (onClose: () => void) => {
    setIsCreatingRoom(true);
    try {
      let result = await axios.post("http://localhost:3000/api/create-room", {
        roomName: inputValue,
      });
      if (result.data.alreadyExists) {
        setRoomNameAlreadyExists(true);
        setIsCreatingRoom(false);
        return;
      }
    } catch (error) {
      // TODO: find if a better way exists for handling the error here
      console.log("Error creating a room");
      console.log(error);
    }
    await update({ roomName: inputValue, role: "owner" });
    onClose();
    setIsCreatingRoom(false);
    router.refresh();
  };

  return (
    <>
      <div
        onClick={() => {
          setRoomNameAlreadyExists(false);
          onOpen();
        }}
        className={cn(
          "block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer h-[15%] font-normal text-gray-700 dark:text-gray-400",
          className
        )}
      >
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-xl">
                  Create a new room
                </ModalHeader>
                <ModalBody>
                  <p className="text-lg">Type a unique room name:</p>
                  <div>
                    <input
                      disabled={isCreatingRoom}
                      className={cn(
                        "w-full bg-slate-400 dark:bg-black rounded-lg dark:border-slate-700 border-2 p-2 ml-1",
                        {
                          "dark:border-red-700 border-red-700":
                            isInvalidInput || roomNameAlreadyExits,
                        }
                      )}
                      onChange={handleInputValueChange}
                    ></input>
                    {roomNameAlreadyExits ? (
                      <>
                        <p className="text-red-700 ml-2">
                          {`Room with name "${inputValue}" already exists. Please give a different name.`}
                        </p>
                      </>
                    ) : null}{" "}
                    {isInvalidInput ? (
                      <>
                        <p className="text-red-700 ml-2">{inputErrorMessage}</p>
                      </>
                    ) : null}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onPress={() => handleCreateRoom(onClose)}
                    className="font-bold"
                    isDisabled={createRoomButtonDisabled}
                    isLoading={isCreatingRoom}
                  >
                    {isCreatingRoom ? "Creating room" : "Create room"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <div className="h-full w-full flex items-center justify-center flex-col">
          <div>
            <AddIcon fontSize="large"></AddIcon>
          </div>
          <p>{"Create a new room"}</p>
        </div>
      </div>
    </>
  );
}
