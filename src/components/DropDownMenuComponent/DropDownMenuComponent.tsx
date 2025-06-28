"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              item.value();
              setOpen(false); 
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
