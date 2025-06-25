"use client";

import { useRouter } from "next/navigation";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Link from "next/link";
import React, { useState } from "react";
import { Select } from "@/components/FormElements/select";

// -------------services-----------------
import { CreditUserGroupSchema } from "../../../../../../lib/schemas";
import { validation, validationProperty } from "@/services/schemaValidation";
import { Loader } from "@/components/Loader/Loader";
import {
  create_user_group,
  get_user_groups_without_pagination,
} from "@/routes/userGroups/userGroupRoutes";
import { create_credit_user_group } from "@/routes/credit_user_groups/creditUserGroupRoutes";
import { get_credit_users_without_pagination } from "@/routes/credit-user/creditUserRoute";
import MultiSelect from "@/components/FormElements/MultiSelect";

// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

type creditUserGroup = {
  leaderID: string;
  memberIDs: string[];
};

type users = {
  label: string;
  value: string;
};

const AddUserGroup = () => {
  const router = useRouter();

  // --------- form for user group details ----------
  const [form, setForm] = React.useState({
    leaderID: "",
    memberIDs: [] as string[],
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
  // --------- state for user ---------
  const [user, setUser] = useState<users[]>([]);

  // --------- functions to do on component mount ---------
  React.useEffect(() => {
    fetchUsers();
  }, []);

  // --------- fetch users ---------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await get_credit_users_without_pagination();
      if (data.success) {
        setUser(data.Details);
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

    const errorMessage = validationProperty(
      CreditUserGroupSchema,
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
    let checkForm = validation(CreditUserGroupSchema, form);
    if (checkForm !== null) {
      setFormErrors(checkForm);
      return;
    }
    // -------- prevent multiple submission
    try {
      if (loading) return;
      setLoading(true);
      const data = await create_credit_user_group(form);

      if (data.success) {
        // ---------- reset form values ---------
        setForm({
          leaderID: "",
          memberIDs: [] as string[],
        });
        setAlert({
          open: true,
          message: "Success",
          description: data.message,
          variant: "default",
        });
        // ---------- redirect to credit user groups page ---------
        router.push("/admin/credit_users/all_user_groups");
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
              <Link
                className="font-medium"
                href="/admin/credit_users/all_user_groups"
              >
                Credit User Groups /
              </Link>
            </li>
            <li className="font-medium text-primary">Add User</li>
          </ol>
        </nav>
      </div>

      <div className="sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="User Details" className="space-y-5.5 !p-6.5">
            <Select
              label="Leader Name"
              items={user}
              defaultValue=""
              placeholder="Select Leader"
              handleChange={(e) => {
                handleChange(e.target.value, "leaderID");
              }}
              value={form.leaderID}
              error={formErrors.leaderID ? formErrors.leaderID : ""}
              required
            />

            {/* <MultiSelect /> */}
            <Select
              label="Members"
              items={user}
              defaultValue="SINGLE"
              handleChange={() => {}}
            />

            <div className="flex justify-end gap-3">
              <button
                className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                type="button"
                onClick={() => {
                  router.push("/admin/credit_users/all_user_groups");
                }}
              >
                Cancel
              </button>
              <button
                className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                type="submit"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Save
              </button>
            </div>
          </ShowcaseSection>
        </div>
      </div>
    </>
  );
};

export default AddUserGroup;
