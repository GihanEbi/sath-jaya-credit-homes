"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// -------------components-----------------
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { AlertDialogDemo } from "@/components/AlertDialog/AlertDialog";

// -------------services-----------------
import { UserGroupSchema } from "../../../../../../lib/schemas";
import { validation, validationProperty } from "@/services/schemaValidation";
import { Loader } from "@/components/Loader/Loader";
import { create_user_group } from "@/routes/userGroups/userGroupRoutes";

// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

const AddUserGroup = () => {
  const router = useRouter();

  // --------- form for user group details ----------
  const [form, setForm] = React.useState({
    groupName: "",
    description: "",
  });
  // --------- form errors for user group details ----------
  const [formErrors, setFormErrors] = useState<any>({});
  // --------- alert for success and error messages ---------
  const [alert, setAlert] = React.useState<Alert>({
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

    const errorMessage = validationProperty(
      UserGroupSchema,
      name,
      value,
    ) as string;

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
    let checkForm = validation(UserGroupSchema, form);
    if (checkForm !== null) {
      setFormErrors(checkForm);
      return;
    }
    // -------- prevent multiple submission
    try {
      if (loading) return;
      setLoading(true);
      const data = await create_user_group(form);

      if (data.success) {
        // ---------- reset form values ---------
        setForm({
          groupName: "",
          description: "",
        });
        setAlert({
          open: true,
          message: "Success",
          description: data.message,
          variant: "default",
        });
        // ---------- redirect to user groups page ---------
        router.push("/admin/users/user_groups");
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
        description: "Error adding user group",
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
          Add User Group
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" href="/">
                Dashboard /
              </Link>
            </li>
            <li>
              <Link className="font-medium" href="/admin/users//user_groups">
                User Groups /
              </Link>
            </li>
            <li className="font-medium text-primary">Add User Group</li>
          </ol>
        </nav>
      </div>

      <div className="sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <ShowcaseSection
            title="User Group Details"
            className="space-y-5.5 !p-6.5"
          >
            <InputGroup
              label="Group Name"
              placeholder="Group Name"
              type="text"
              required
              handleChange={(e) => handleChange(e.target.value, "groupName")}
              value={form.groupName}
              error={formErrors.groupName ? formErrors.groupName : ""}
            />

            <TextAreaGroup
              label="Description"
              placeholder="Description"
              handleChange={(e) => handleChange(e.target.value, "description")}
              value={form.description}
            />

            <div className="flex justify-end gap-3">
              <button
                className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                type="button"
                onClick={() => {
                  router.push("/admin/users/user_groups");
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

export default AddUserGroup;
