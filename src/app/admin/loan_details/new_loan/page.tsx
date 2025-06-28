"use client";
import React, { Suspense } from "react";
import NewLoanComponent from "./NewLoanComponent";

const NewLoan = () => {
  return (
    <Suspense>
      <NewLoanComponent />
    </Suspense>
  );
};

export default NewLoan;
