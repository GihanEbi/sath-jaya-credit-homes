"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { EllipsisVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

type optionList = {
  label: string;
  value: Function;
};

type DropDownIconMenuComponentProps = {
  // Define any props you need here
  options: optionList[];
};

const DropDownMenuComponent: React.FC<DropDownIconMenuComponentProps> = ({
  options,
}) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              item.value();
            }}
            className="cursor-pointer"
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenuComponent;
