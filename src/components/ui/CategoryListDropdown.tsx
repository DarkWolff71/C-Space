"use client";

import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Selection,
} from "@nextui-org/react";
import { useRecoilState } from "recoil";
import { categoryIdState } from "@/recoil-store/atoms/upload-video";
import { getCategoryList } from "@/lib/constants/videoCategories";

const CATEGORY_LIST = getCategoryList();

export function CategoryListDropdown() {
  const categoryList = CATEGORY_LIST;
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set([])
  );
  let [categoryIdStateVar, setCategoryIdState] =
    useRecoilState(categoryIdState);
  let [displayCategory, setDisplayCategory] = useState<string | null>(null);
  let selectedValueWhenCategoryIdStateChanges = React.useMemo(() => {
    const category = categoryList.find(
      (category) => category.id === categoryIdStateVar
    )?.title;

    if (category) {
      setDisplayCategory(category);
    }
    return category;
  }, [categoryIdStateVar]);

  let selectedValue = React.useMemo(() => {
    const category = Array.from(selectedKeys).join(", ");
    if (category) {
      setDisplayCategory(category);
    }

    return category;
  }, [selectedKeys]);

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
          {displayCategory ? displayCategory : "--Choose a category--"}
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
                setCategoryIdState(category.id);
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
