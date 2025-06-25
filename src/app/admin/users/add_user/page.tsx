"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// -------------components-----------------
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { AlertDialogDemo } from "@/components/AlertDialog/AlertDialog";
import { Select } from "@/components/FormElements/select";

// -------------services-----------------
import { UserSchema } from "../../../../../lib/schemas";
import { validation, validationProperty } from "@/services/schemaValidation";
import { Loader } from "@/components/Loader/Loader";
import { get_user_groups_without_pagination } from "@/routes/userGroups/userGroupRoutes";
import { create_user } from "@/routes/users/userRoutes";

// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

type userGroup = {
  label: string;
  value: string;
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
    userGroupId: "",
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
  // --------- state for user groups ---------
  const [userGroups, setUserGroups] = useState<userGroup[]>([]);

  // --------- functions to do on component mount ---------
  React.useEffect(() => {
    fetchUserGroups();
  }, []);

  // --------- fetch user groups ---------
  const fetchUserGroups = async () => {
    try {
      setLoading(true);
      const data = await get_user_groups_without_pagination();
      if (data.success) {
        setUserGroups(data.Details);
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
        description: "Error fetching user groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------- handleChange for input fields ---------
  const handleChange = (value: string, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    const errorMessage = validationProperty(UserSchema, name, value) as string;

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
    let checkForm = validation(UserSchema, form);
    if (checkForm !== null) {
      setFormErrors(checkForm);
      return;
    }
    // -------- prevent multiple submission
    if (loading) return;
    try {
      setLoading(true);
      const data = await create_user(form);

      if (data.success) {
        setAlert({
          open: true,
          message: "Success",
          description: data.message,
          variant: "default",
        });
        router.push("/admin/users");
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
        <div className="flex h-screen items-center justify-center">
          <Loader size={40} className="text-blue-500" />
        </div>
      )}
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
              <Link className="font-medium" href="/admin/users/">
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
              value={form.firstName}
              error={formErrors.firstName ? formErrors.firstName : ""}
              required
            />
            <InputGroup
              label="Last Name"
              placeholder="Last Name"
              type="text"
              handleChange={(e) => {
                handleChange(e.target.value, "lastName");
              }}
              value={form.lastName}
              error={formErrors.lastName ? formErrors.lastName : ""}
              required
            />
            <InputGroup
              label="Date of Birth"
              placeholder="date of birth"
              type="date"
              handleChange={(e) => {
                handleChange(e.target.value, "birthday");
              }}
              value={form.birthday}
              error={formErrors.birthday ? formErrors.birthday : ""}
              required
            />
            <InputGroup
              label="Email"
              placeholder="Email"
              type="text"
              handleChange={(e) => {
                handleChange(e.target.value, "email");
              }}
              value={form.email}
              error={formErrors.email ? formErrors.email : ""}
              required
            />
            <InputGroup
              label="Phone No"
              placeholder="Phone No"
              type="text"
              handleChange={(e) => {
                handleChange(e.target.value, "phoneNo");
              }}
              value={form.phoneNo}
              error={formErrors.phoneNo ? formErrors.phoneNo : ""}
              required
            />

            <TextAreaGroup
              label="Address"
              placeholder="Address"
              handleChange={(e) => {
                handleChange(e.target.value, "address");
              }}
              value={form.address}
              error={formErrors.address ? formErrors.address : ""}
              required
            />
            <Select
              label="User Group"
              items={userGroups}
              defaultValue=""
              placeholder="Select User Group"
              handleChange={(e) => {
                handleChange(e.target.value, "userGroupId");
              }}
              value={form.userGroupId}
              error={formErrors.userGroupId ? formErrors.userGroupId : ""}
              required
            />

            <div className="flex justify-end gap-3">
              <button
                className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                type="button"
                onClick={() => {
                  router.push("/admin/users");
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
