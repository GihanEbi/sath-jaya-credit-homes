"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// --------- components ---------
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";

// --------- services ---------
import { LoginSchema } from "../../../lib/schemas";
import { validation, validationProperty } from "@/services/schemaValidation";
import { Loader } from "../Loader/Loader";
import { AlertDialogDemo } from "../AlertDialog/AlertDialog";
import { saveToken } from "@/utils/auth-utils";

// --------- types ---------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

type LoginData = {
  email: string;
  password: string;
};

export default function LoginWithPassword() {
  const router = useRouter();

  // --------- form for user login details ----------
  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });
  // --------- form errors for user group details ----------
  const [formErrors, setFormErrors] = useState<any>({});
  // --------- alert for success and error messages ---------
  const [alert, setAlert] = useState<Alert>({
    open: false,
    message: "",
    description: "",
    variant: "default",
  });
  // --------- state for loading spinner ---------
  const [loading, setLoading] = useState(false);

  // -------- handleChange for input fields ---------
  const handleChange = (value: string, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    const errorMessage = validationProperty(LoginSchema, name, value) as string;

    if (errorMessage !== null) {
      setFormErrors({
        ...formErrors,
        [name]: errorMessage,
      });
    } else {
      setFormErrors((prevData: any) => {
        // --------Create a shallow copy of the object
        const updatedData = { ...prevData };

        // --------Remove the key
        delete updatedData[name];

        // --------Return the updated object
        return updatedData;
      });
    }
  };

  // -------- handleSubmit for form submission ---------
  const handleSubmit = async () => {
    // -------- check full form validation
    let checkForm = validation(LoginSchema, form);
    if (checkForm !== null) {
      setFormErrors(checkForm);
      return;
    }
    // -------- prevent multiple submission
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data?.token) {
        saveToken(data.token);
        setAlert({
          open: true,
          message: "Success",
          description: "Login successfully",
          variant: "default",
        });
        router.push("/admin/dashboard");
      } else {
        setAlert({
          open: true,
          message: "Error login",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Error login",
        description: "Error adding user",
        variant: "destructive",
      });
    } finally {
      // --------- set loading to false ---------
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
      <div>
        <InputGroup
          type="email"
          label="Email"
          className="mb-4 [&_input]:py-[15px]"
          placeholder="Enter your email"
          name="email"
          handleChange={(e) => {
            handleChange(e.target.value, "email");
          }}
          value={form.email}
          icon={<EmailIcon />}
          error={formErrors.email ? formErrors.email : ""}
          required
        />

        <InputGroup
          type="password"
          label="Password"
          className="mb-5 [&_input]:py-[15px]"
          placeholder="Enter your password"
          name="password"
          handleChange={(e) => {
            handleChange(e.target.value, "password");
          }}
          value={form.password}
          icon={<PasswordIcon />}
          error={formErrors.password ? formErrors.password : ""}
          required
        />

        <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
          <Link
            href="/auth/forgot-password"
            className="hover:text-primary dark:text-white dark:hover:text-primary"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mb-4.5">
          <button
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
            onClick={() => {
              handleSubmit();
            }}
          >
            Login
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
            )}
          </button>
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
}
