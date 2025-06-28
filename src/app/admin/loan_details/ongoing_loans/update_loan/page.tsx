"use client";
import React, { Suspense } from "react";
import UpdateLoanComponent from "./UpdateLoanComponent";

const UpdateLoan = () => {
  return (
    <Suspense>
      <UpdateLoanComponent />
    </Suspense>
  );
};

export default UpdateLoan;
