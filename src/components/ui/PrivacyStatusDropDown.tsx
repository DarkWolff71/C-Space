"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Selection,
} from "@nextui-org/react";
import { useSetRecoilState } from "recoil";
import { privacyStatusState } from "@/recoil-store/atoms/upload-video";

export function PrivacyStatusDropDown() {
  const PRIVACY_STATUS_LIST = [
    { title: "Private", value: "private" },
    { title: "Public", value: "public" },
    { title: "Unlisted", value: "unlisted" },
  ];

  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set(["private"])
  );
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  const handleSelectionChange = (keys: Selection) => {
    if (typeof keys === "string") {
      setSelectedKeys(new Set([keys]));
    } else {
      setSelectedKeys(keys as Set<string>);
    }
  };

  let setPrivacyStatus = useSetRecoilState(privacyStatusState);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        {
          // @ts-ignore
          PRIVACY_STATUS_LIST.map((privacyStatus) => (
            <DropdownItem
              key={privacyStatus.title}
              value={privacyStatus.value}
              onPress={(e) => {
                setPrivacyStatus(privacyStatus.value);
              }}
            >
              {privacyStatus.title}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
    </Dropdown>
  );
}
