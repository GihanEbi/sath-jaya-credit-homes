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

const NewLoan = () => {
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          New Loan Application
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" href="/">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">New Loan application</li>
          </ol>
        </nav>
      </div>

      <div className="sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Loan Details" className="space-y-5.5 !p-6.5">
            <InputGroup
              label="Branch Name"
              placeholder="Branch Name"
              type="text"
              handleChange={handleChange}
            />
            <InputGroup
              label="Center Number"
              placeholder="Center Number"
              type="text"
              handleChange={handleChange}
            />
            <InputGroup
              label="Member Number"
              placeholder="Member Number"
              type="text"
              handleChange={handleChange}
            />
            <InputGroup
              label="Team Number"
              placeholder="Team Number"
              type="text"
              handleChange={handleChange}
            />
            {/* ================== applicant details ========================= */}
            <div className="relative">
              <div className="mb-3">Applicant Details</div>
              <div className="mt-0 h-px w-full bg-gray-300"></div>
            </div>

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
              <div className="flex flex-col gap-9">
                <Select
                  label="Applicant Name"
                  items={[
                    { label: "Gihan Piumal", value: "SINGLE" },
                    { label: "Gayan Lakmal", value: "MARRIED" },
                    { label: "Suranga Kalum", value: "DiVORCED" },
                  ]}
                  defaultValue="SINGLE"
                />
                <InputGroup
                  label="Name of main income person of the family"
                  placeholder="Name of main income person of the family"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Phone Number of main income person of the family"
                  placeholder="Phone Number of main income person of the family"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Monthly family income of the applicant"
                  placeholder="Monthly family income of the applicant"
                  type="text"
                  handleChange={handleChange}
                />
                <Select
                  label="Do you get any loan before any other organization"
                  items={[
                    { label: "Yes", value: "YES" },
                    { label: "No", value: "NO" },
                  ]}
                  defaultValue="NO"
                />
                <InputGroup
                  label="Loan Amount"
                  placeholder="Loan Amount"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Balance loan amount"
                  placeholder="Balance loan amount"
                  type="text"
                  handleChange={handleChange}
                />
              </div>
              {/* -------------------- */}
              <div className="flex flex-col gap-9">
                <TextAreaGroup
                  label="Purpose of the loan"
                  placeholder="Purpose of the loan"
                />
                <InputGroup
                  label="NIC of main income person"
                  placeholder="NIC of main income person"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Relationship"
                  placeholder="Relationship"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Organization Name"
                  placeholder="Organization Name"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Instalment"
                  placeholder="Instalment"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Home location google map link"
                  placeholder="Home location google map link"
                  type="text"
                  handleChange={handleChange}
                />
              </div>
            </div>

            {/* ============ Sheared applicant details ========================= */}
            <div className="relative">
              <div className="mb-3">Sheared Applicant Details</div>
              <div className="mt-0 h-px w-full bg-gray-300"></div>
            </div>
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
              <div className="flex flex-col gap-9">
                <InputGroup
                  label="Sheared applicant full name"
                  placeholder="Sheared applicant full name"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Sheared applicant NIC"
                  placeholder="Sheared applicant NIC"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Sheared applicant phone no"
                  placeholder="Sheared applicant phone no"
                  type="text"
                  handleChange={handleChange}
                />
                <Select
                  label="Sheared applicant marital status"
                  items={[
                    { label: "Yes", value: "YES" },
                    { label: "No", value: "NO" },
                  ]}
                  defaultValue="NO"
                />
              </div>
              <div className="flex flex-col gap-9">
                <TextAreaGroup
                  label="Sheared applicant address"
                  placeholder="Sheared applicant address"
                />
                <InputGroup
                  label="Sheared applicant Birthday"
                  placeholder="Sheared applicant Birthday"
                  type="text"
                  handleChange={handleChange}
                />
              </div>
            </div>

            {/* ============ Guarantor details ========================= */}

            <div className="relative">
              <div className="mb-3">Guarantor Details</div>
              <div className="mt-0 h-px w-full bg-gray-300"></div>
            </div>
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
              <div className="flex flex-col gap-9">
                <Select
                  label="Guarantor 1 Name"
                  items={[
                    { label: "Gihan Piumal", value: "SINGLE" },
                    { label: "Gayan Lakmal", value: "MARRIED" },
                    { label: "Suranga Kalum", value: "DiVORCED" },
                  ]}
                  defaultValue="SINGLE"
                />
                <Select
                  label="Guarantor 3 Name"
                  items={[
                    { label: "Gihan Piumal", value: "SINGLE" },
                    { label: "Gayan Lakmal", value: "MARRIED" },
                    { label: "Suranga Kalum", value: "DiVORCED" },
                  ]}
                  defaultValue="SINGLE"
                />
              </div>
              <div className="flex flex-col gap-9">
                <Select
                  label="Guarantor 2 Name"
                  items={[
                    { label: "Gihan Piumal", value: "SINGLE" },
                    { label: "Gayan Lakmal", value: "MARRIED" },
                    { label: "Suranga Kalum", value: "DiVORCED" },
                  ]}
                  defaultValue="SINGLE"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                type="button"
                onClick={() => {
                  router.push("/");
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

export default NewLoan;
