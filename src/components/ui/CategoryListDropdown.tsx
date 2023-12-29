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
import { categoryIdState } from "@/recoil-store/atoms/upload-video";
import { getCategoryList } from "@/lib/constants/videoCategories";

const CATEGORY_LIST = getCategoryList();

export function CategoryListDropdown() {
  const categoryList = CATEGORY_LIST;
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set([])
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

  let setCategoryId = useSetRecoilState(categoryIdState);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedValue ? selectedValue : "--Choose a category--"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Video category options"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        {[
          <DropdownItem key={"--Choose a category--"}>
            {"--Choose a category--"}
          </DropdownItem>,
          // @ts-ignore
          categoryList.map((category) => (
            <DropdownItem
              key={category.title}
              value={category.id}
              onPress={(e) => {
                setCategoryId(category.id);
              }}
            >
              {category.title}
            </DropdownItem>
          )),
        ]}
      </DropdownMenu>
    </Dropdown>
  );
}
