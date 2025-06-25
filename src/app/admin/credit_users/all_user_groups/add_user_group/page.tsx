"use client";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import DatePickerTwo from "@/components/FormElements/DatePicker/DatePickerTwo";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Switch } from "@/components/FormElements/switch";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Link from "next/link";
import React from "react";
import { Select } from "@/components/FormElements/select";
import { GlobeIcon, UploadIcon } from "@/assets/icons";
import MultiSelect from "@/components/FormElements/MultiSelect";
import Image from "next/image";

const AddUserGroup = () => {
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
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
                href="admin/credit_users/all_user_groups"
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
              items={[
                { label: "Gihan Piumal", value: "SINGLE" },
                { label: "Gayan Lakmal", value: "MARRIED" },
                { label: "Suranga Kalum", value: "DiVORCED" },
              ]}
              defaultValue="SINGLE"
              handleChange={()=>{}}
            />
            <Select
              label="Members"
              items={[
                { label: "Gihan Piumal", value: "SINGLE" },
                { label: "Gayan Lakmal", value: "MARRIED" },
                { label: "Suranga Kalum", value: "DiVORCED" },
              ]}
              defaultValue="SINGLE"
              handleChange={()=>{}}
            />

            <div className="flex justify-end gap-3">
              <button
                className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                type="button"
                onClick={() => {
                  router.push("/credit_users/all_user_groups");
                }}
              >
                Cancel
              </button>
              <button
                className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                type="submit"
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
