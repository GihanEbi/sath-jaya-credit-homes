'use client";';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertDestructive } from "../Alert/Alert";
import React from "react";

type variant = "default" | "destructive";

type AlertDialogDemoProps = {
  isOpen: boolean;
  title: string;
  description: string;
  variant: variant;
  handleCancel: Function;
};

export function AlertDialogDemo({
  isOpen,
  title,
  description,
  variant,
  handleCancel,
}: AlertDialogDemoProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogHeader>
          <AlertDialogDescription>
            <AlertDestructive
              title={title}
              description={description}
              variant={variant}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              handleCancel();
            }}
          >
            Ok
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
