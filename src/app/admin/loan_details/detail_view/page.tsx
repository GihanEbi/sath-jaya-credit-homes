"use client";
import React, { Suspense } from "react";
import LoanDetailsComponent from "./LoanDetailsComponent"

const LoanDetails = () => {
  return (
    <Suspense>
      <LoanDetailsComponent />
    </Suspense>
  );
};

export default LoanDetails;
