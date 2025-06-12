"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const userData = {
  ID: "CUS00001",
  fullName: "Don Maniwelge Gihan Piumal alwis",
  gender: "Male",
  maritalStatus: "Married",
  email: "gihanpiumal7@gmail.com",
  nic: "953092190V",
  dob: "1995-11-04",
  phone: "0776603689",
  address: "No-337, Perera Road, Alubomulla",
  status: "Active",
  profilePhoto: "/images/user/user-03.png",
  coverPhoto: "/images/cover/cover-01.png",
};

const Profile = () => {
  return (
    <div className="mx-auto w-full max-w-[970px]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          Profile
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" href="/">
                Dashboard /
              </Link>
            </li>
            <li>
              <Link className="font-medium" href="/credit_users/all_users">
                Credit Users /
              </Link>
            </li>
            <li className="font-medium text-primary">Profile</li>
          </ol>
        </nav>
      </div>

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={userData?.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              {userData?.profilePhoto && (
                <>
                  <Image
                    src={userData?.profilePhoto}
                    width={160}
                    height={160}
                    className="overflow-hidden rounded-full"
                    alt="profile"
                  />
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {userData?.fullName}
            </h3>
          </div>
        </div>
        <ShowcaseSection title="User Details" className="space-y-5.5 !p-6.5">
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    User ID
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {userData?.ID}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Email
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {userData?.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Birthday
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {userData?.dob}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Address
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {userData?.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Gender
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {userData?.gender}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    NIC
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {userData?.nic}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Phone no
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {userData?.phone}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Status
                  </p>
                  {/* <p className="text-muted-foreground text-sm">
                    {userData?.status}
                  </p> */}
                  <div
                    className={cn(
                      "max-w-fit rounded-full py-1 text-sm font-medium",
                      {
                        "text-[#219653]": userData?.status === "Active",
                        "text-[#D34053]": userData?.status === "Deactivated",
                        //   "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                        //     item.status === "Pending",
                      },
                    )}
                  >
                    {userData?.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </div>
  );
};

export default Profile;
