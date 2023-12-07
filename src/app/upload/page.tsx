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

export default function App() {
  const PRIVACY_STATUS_LIST = ["private", "public", "unlisted"];

  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set()
  );
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys),
    [selectedKeys]
  );

  const handleSelectionChange = (keys: Selection) => {
    if (typeof keys === "string") {
      setSelectedKeys(new Set([keys]));
    } else {
      setSelectedKeys(keys as Set<string>);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedValue ? selectedValue : "--Choose the privacy status--"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        {[
          <DropdownItem key={"not-selected"}>
            {"--Choose the privacy status--"}
          </DropdownItem>,
          // @ts-ignore
          PRIVACY_STATUS_LIST.map((privacyStatus) => (
            <DropdownItem key={privacyStatus} value={privacyStatus}>
              {privacyStatus}
            </DropdownItem>
          )),
        ]}
      </DropdownMenu>
    </Dropdown>
  );
}
