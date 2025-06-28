"use client";
import React, { Suspense } from "react";
import AddUserComponent from "./AddUserComponent";

const AddUser = () => {
  return (
    <Suspense>
      <AddUserComponent />
    </Suspense>
  );
};

export default AddUser;
