"use client";
import React, { Suspense } from "react";
import ProfileComponent from "./ProfileComponent";

const Profile = () => {
  return (
    <Suspense>
      <ProfileComponent />
    </Suspense>
  );
};

export default Profile;
