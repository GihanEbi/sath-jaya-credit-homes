"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    // login page
    router.push("login");
  }, []);
  return <div></div>;
};

export default Dashboard;
