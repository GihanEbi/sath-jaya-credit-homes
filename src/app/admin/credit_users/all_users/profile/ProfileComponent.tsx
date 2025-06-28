"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "@/components/Loader/Loader";
import React, { useEffect } from "react";
import {
  get_credit_user_by_id,
  get_credit_users,
} from "@/routes/credit-user/creditUserRoute";
import { AlertDialogDemo } from "@/components/AlertDialog/AlertDialog";
import { useSearchParams } from "next/navigation";

// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

type userObj = {
  ID: string;
  creditUserID: string;
  fullName: string;
  gender: string;
  birthday: string;
  permanentAddress: string;
  phoneNo: string;
  address: string;
  nic: string;
  maritalStatus: string;
  email: string;
  profilePicture: string;
  nicFrontPicture: string;
  nicBackPicture: string;
  locationCertificationPicture: string;
  isActive: boolean;
};

const ProfileComponent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("userID");
  // --------- alert for success and error messages ---------
  const [alert, setAlert] = React.useState<Alert>({
    open: false,
    message: "",
    description: "",
    variant: "default",
  });
  // --------- state for loading spinner ---------
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState<userObj | null>(null);
  // --------- first render to get users data ---------
  useEffect(() => {
    fetchUserData(id);
  }, []);

  // --------- function to get users data ---------
  const fetchUserData = async (userID: string | null) => {
    try {
      setLoading(true);

      const data = await get_credit_user_by_id(userID);
      if (data.success) {
        setUserData(data.Details);
      } else {
        setAlert({
          open: true,
          message: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Error",
        description: "Error fetching user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-dark/50">
          <Loader />
        </div>
      )}
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
                <Link
                  className="font-medium"
                  href="/admin/credit_users/all_users"
                >
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
              src="/images/cover/cover-01.png"
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
                {userData?.profilePicture && (
                  <Image
                    src={userData?.profilePicture}
                    width={160}
                    height={160}
                    className="overflow-hidden rounded-full"
                    alt="profile"
                  />
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
                    <p className="text-sm text-muted-foreground">
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
                    <p className="text-sm text-muted-foreground">
                      {userData?.email ? userData?.email : "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[25px_1fr] items-start">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-dark dark:text-white">
                      Birthday
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userData?.birthday}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[25px_1fr] items-start">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-dark dark:text-white">
                      Address
                    </p>
                    <p className="text-sm text-muted-foreground">
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
                    <p className="text-sm text-muted-foreground">
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
                    <p className="text-sm text-muted-foreground">
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
                    <p className="text-sm text-muted-foreground">
                      {userData?.phoneNo}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[25px_1fr] items-start">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-dark dark:text-white">
                      Status
                    </p>
                    <div
                      className={cn(
                        "max-w-fit rounded-full py-1 text-sm font-medium",
                        {
                          "text-[#219653]": userData?.isActive,
                          "text-[#D34053]": !userData?.isActive,
                        },
                      )}
                    >
                      {userData?.isActive ? "Active" : "Deactivated"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
};

export default ProfileComponent;
