"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputGroup from "../FormElements/InputGroup";

type ConfirmationDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  isInput?: boolean;
  inputLabel?: string;
  inputChange?: Function;
  inputValue?: string;
  inputPlaceholder?: string;
  isInputRequired?: boolean;
  onSubmit: Function;
  onCancel: () => void;
  isSaveButton?: boolean; // Optional prop to control the save button
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  description,
  isInput,
  inputPlaceholder,
  onSubmit,
  inputLabel,
  inputChange,
  inputValue,
  isInputRequired,
  onCancel,
  isSaveButton,
}) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {isInput && (
            <InputGroup
              label={inputLabel ? inputLabel : "Remarks"}
              placeholder={
                inputPlaceholder ? inputPlaceholder : "Enter remarks"
              }
              type="text"
              handleChange={(e) => {
                inputChange && inputChange(e);
              }}
              value={inputValue ? inputValue : ""}
              required={isInputRequired}
            />
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {isSaveButton && (
              <Button
                onClick={() => {
                  onSubmit();
                }}
              >
                Save changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfirmationDialog;
