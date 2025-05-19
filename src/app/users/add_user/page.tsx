"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// -------------components-----------------
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { AlertDialogDemo } from "@/components/AlertDialog/AlertDialog";

// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

const AddUser = () => {
  const router = useRouter();

// --------- form for user details ----------
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    email: "",
    phoneNo: "",
    address: "",
  });
// --------- alert for success and error messages ---------
  const [alert, setAlert] = useState<Alert>({
    open: false,
    message: "",
    description: "",
    variant: "default",
  });

  // -------- handleChange for input fields ---------
  const handleChange = (value: string, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -------- handleSubmit for form submission ---------
  const handleSubmit = async () => {
    const res = await fetch("/api/users/add-user", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.user) {
      setAlert({
        open: true,
        message: "Success",
        description: "User added successfully",
        variant: "default",
      });
      router.push("/users");
    } else {
      setAlert({
        open: true,
        message: "Error",
        description: data.error,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          Add User
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" href="/">
                Dashboard /
              </Link>
            </li>
            <li>
              <Link className="font-medium" href="/users/">
                Users /
              </Link>
            </li>
            <li className="font-medium text-primary">Add User</li>
          </ol>
        </nav>
      </div>

      <div className="sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="User Details" className="space-y-5.5 !p-6.5">
            <InputGroup
              label="First Name"
              placeholder="First Name"
              type="text"
              handleChange={(e) => {
                handleChange(e.target.value, "firstName");
              }}
            />
            <InputGroup
              label="Last Name"
              placeholder="Last Name"
              type="text"
              handleChange={(e) => {
                handleChange(e.target.value, "lastName");
              }}
            />
            <InputGroup
              label="Date of Birth"
              placeholder="date of birth"
              type="date"
              handleChange={(e) => {
                handleChange(e.target.value, "birthday");
              }}
            />
            <InputGroup
              label="Email"
              placeholder="Email"
              type="text"
              handleChange={(e) => {
                handleChange(e.target.value, "email");
              }}
            />
            <InputGroup
              label="Phone No"
              placeholder="Phone No"
              type="text"
              handleChange={(e) => {
                handleChange(e.target.value, "phoneNo");
              }}
            />

            <TextAreaGroup
              label="Address"
              placeholder="Address"
              handleChange={(e) => {
                handleChange(e.target.value, "address");
              }}
            />

            <div className="flex justify-end gap-3">
              <button
                className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                type="button"
                onClick={() => {
                  router.push("/users");
                }}
              >
                Cancel
              </button>
              <button
                className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Save
              </button>
            </div>
          </ShowcaseSection>
        </div>
        <AlertDialogDemo
          isOpen={alert.open}
          title={alert.message}
          description={alert.description}
          variant={alert.variant}
          handleCancel={() => {
            setAlert({ ...alert, open: false });
          }}
        />
      </div>
    </>
  );
};

export default AddUser;
