"use client";
import React, { Suspense } from "react";
import AddUserGroupComponent from "./AddUserGroupComponent";

const AddUserGroup = () => {
  return (
    <Suspense>
      <AddUserGroupComponent />
    </Suspense>
  );
};

export default AddUserGroup;
