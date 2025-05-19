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

const AddUser = () => {
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
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
              <Link className="font-medium" href="/credit_users/all_users">
                Credit Users /
              </Link>
            </li>
            <li className="font-medium text-primary">Add User</li>
          </ol>
        </nav>
      </div>

      <div className="sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="User Details" className="space-y-5.5 !p-6.5">
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
              <div className="flex flex-col gap-9">
                <InputGroup
                  label="Full Name"
                  placeholder="Full Name"
                  type="text"
                  handleChange={handleChange}
                />
                <Select
                  label="Gender"
                  items={[
                    { label: "Female", value: "FEMALE" },
                    { label: "Male", value: "MALE" },
                    { label: "Other", value: "OTHER" },
                  ]}
                  defaultValue="SINGLE"
                />
                <InputGroup
                  label="NIC"
                  placeholder="NIC"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Phone No"
                  placeholder="Phone No"
                  type="text"
                  handleChange={handleChange}
                />

                <Select
                  label="Marital Status"
                  items={[
                    { label: "Single", value: "SINGLE" },
                    { label: "Married", value: "MARRIED" },
                    { label: "Divorced", value: "DiVORCED" },
                    { label: "Separated", value: "SEPARATED" },
                    { label: "Widowed", value: "WIDOWED" },
                  ]}
                  defaultValue="SINGLE"
                />
                <form>
                  <div className="mb-4 flex items-center gap-3">
                    <Image
                      src="/images/user/user-03.png"
                      width={55}
                      height={55}
                      alt="User"
                      className="size-14 rounded-full object-cover"
                      quality={90}
                    />

                    <div>
                      <span className="mb-1.5 font-medium text-dark dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-3">
                        <button
                          type="button"
                          className="text-body-sm hover:text-red"
                        >
                          Delete
                        </button>
                        <button className="text-body-sm hover:text-primary">
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      accept="image/png, image/jpg, image/jpeg"
                      hidden
                    />

                    <label
                      htmlFor="profilePhoto"
                      className="flex cursor-pointer flex-col items-center justify-center p-4 sm:py-7.5"
                    >
                      <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                        <UploadIcon />
                      </div>

                      <p className="mt-2.5 text-body-sm font-medium">
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>

                      <p className="mt-1 text-body-xs">
                        SVG, PNG, JPG or GIF (max, 800 X 800px)
                      </p>
                    </label>
                  </div>
                </form>
                <form>
                  <div className="mb-4 flex items-center gap-3">
                    <Image
                      src="/images/user/user-03.png"
                      width={55}
                      height={55}
                      alt="User"
                      className="size-14 rounded-full object-cover"
                      quality={90}
                    />

                    <div>
                      <span className="mb-1.5 font-medium text-dark dark:text-white">
                        NIC back
                      </span>
                      <span className="flex gap-3">
                        <button
                          type="button"
                          className="text-body-sm hover:text-red"
                        >
                          Delete
                        </button>
                        <button className="text-body-sm hover:text-primary">
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      accept="image/png, image/jpg, image/jpeg"
                      hidden
                    />

                    <label
                      htmlFor="NIC"
                      className="flex cursor-pointer flex-col items-center justify-center p-4 sm:py-7.5"
                    >
                      <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                        <UploadIcon />
                      </div>

                      <p className="mt-2.5 text-body-sm font-medium">
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>

                      <p className="mt-1 text-body-xs">
                        SVG, PNG, JPG or GIF (max, 800 X 800px)
                      </p>
                    </label>
                  </div>
                </form>
              </div>
              <div className="flex flex-col gap-9">
                <InputGroup
                  label="Permanent Address"
                  placeholder="Permanent Address"
                  type="text"
                  handleChange={handleChange}
                />
                <InputGroup
                  label="Birthday"
                  placeholder="Birthday"
                  type="text"
                  handleChange={handleChange}
                />
                <TextAreaGroup label="Address" placeholder="Address" />
                
                <InputGroup
                  label="Email Address"
                  placeholder="Email Address"
                  type="text"
                  handleChange={handleChange}
                />
                <form>
                  <div className="mb-4 flex items-center gap-3">
                    <Image
                      src="/images/user/user-03.png"
                      width={55}
                      height={55}
                      alt="User"
                      className="size-14 rounded-full object-cover"
                      quality={90}
                    />

                    <div>
                      <span className="mb-1.5 font-medium text-dark dark:text-white">
                        NIC front
                      </span>
                      <span className="flex gap-3">
                        <button
                          type="button"
                          className="text-body-sm hover:text-red"
                        >
                          Delete
                        </button>
                        <button className="text-body-sm hover:text-primary">
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      accept="image/png, image/jpg, image/jpeg"
                      hidden
                    />

                    <label
                      htmlFor="NIC"
                      className="flex cursor-pointer flex-col items-center justify-center p-4 sm:py-7.5"
                    >
                      <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                        <UploadIcon />
                      </div>

                      <p className="mt-2.5 text-body-sm font-medium">
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>

                      <p className="mt-1 text-body-xs">
                        SVG, PNG, JPG or GIF (max, 800 X 800px)
                      </p>
                    </label>
                  </div>
                </form>
                <form>
                  <div className="mb-4 flex items-center gap-3">
                    <Image
                      src="/images/user/user-03.png"
                      width={55}
                      height={55}
                      alt="User"
                      className="size-14 rounded-full object-cover"
                      quality={90}
                    />

                    <div>
                      <span className="mb-1.5 font-medium text-dark dark:text-white">
                        Location certification
                      </span>
                      <span className="flex gap-3">
                        <button
                          type="button"
                          className="text-body-sm hover:text-red"
                        >
                          Delete
                        </button>
                        <button className="text-body-sm hover:text-primary">
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      accept="image/png, image/jpg, image/jpeg"
                      hidden
                    />

                    <label
                      htmlFor="NIC"
                      className="flex cursor-pointer flex-col items-center justify-center p-4 sm:py-7.5"
                    >
                      <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                        <UploadIcon />
                      </div>

                      <p className="mt-2.5 text-body-sm font-medium">
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>

                      <p className="mt-1 text-body-xs">
                        SVG, PNG, JPG or GIF (max, 800 X 800px)
                      </p>
                    </label>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                type="button"
                onClick={() => {
                  router.push("/credit_users/all_users");
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

export default AddUser;
