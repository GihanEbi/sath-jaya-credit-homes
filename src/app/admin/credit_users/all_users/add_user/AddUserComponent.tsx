"use client";

import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Link from "next/link";
import React, { useState } from "react";
import { Select } from "@/components/FormElements/select";
import { UploadIcon } from "@/assets/icons";
import Image from "next/image";
import { validation, validationProperty } from "@/services/schemaValidation";
import { creditUserSchema } from "../../../../../../lib/schemas";
import {
  create_credit_user,
  edit_credit_user,
  get_credit_user_by_id,
} from "@/routes/credit-user/creditUserRoute";
import { userConstants } from "@/constants/user_constants";
import { upload_file } from "@/routes/upload/uploadRoutes";
import { config } from "@/config";
import { Loader } from "@/components/Loader/Loader";
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

type User = {
  creditUserID: string;
  fullName: string;
  gender: string;
  birthday: string;
  permanentAddress: string;
  phoneNo: string;
  address: string;
  nic: string;
  maritalState: string;
  email: string;
  profilePicture: string;
  nicFrontPicture: string;
  nicBackPicture: string;
  locationCertificationPicture: string;
};

const AddUserComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --------- form for user details ----------
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    birthday: "",
    permanentAddress: "",
    phoneNo: "",
    address: "",
    nic: "",
    maritalState: "",
    email: "",
    profilePicture: "",
    nicFrontPicture: "",
    nicBackPicture: "",
    locationCertificationPicture: "",
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

  // --------- get userID from query params if exists ---------
  const userID = searchParams.get("userID");
  // --------- if userID exists, fetch user details and set form state ---------
  React.useEffect(() => {
    if (userID) {
      fetchUserData(userID);
    }
  }, [userID]);

  // --------- function to get users data ---------
  const fetchUserData = async (userID: string | null) => {
    try {
      setLoading(true);

      const data = await get_credit_user_by_id(userID);

      if (data.success) {
        setForm({
          fullName: data.Details.fullName,
          gender: data.Details.gender,
          birthday: data.Details.birthday,
          permanentAddress: data.Details.permanentAddress,
          phoneNo: data.Details.phoneNo,
          address: data.Details.address,
          nic: data.Details.nic,
          maritalState: data.Details.maritalState,
          email: data.Details.email,
          profilePicture: data.Details.profilePicture,
          nicFrontPicture: data.Details.nicFrontPicture,
          nicBackPicture: data.Details.nicBackPicture,
          locationCertificationPicture:
            data.Details.locationCertificationPicture,
        });
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

  // -------- handleChange for input fields ---------
  const handleChange = (value: string, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    const errorMessage = validationProperty(
      creditUserSchema,
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
    let checkForm = validation(creditUserSchema, form);

    if (checkForm !== null) {
      setFormErrors(checkForm);
      return;
    }
    // -------- prevent multiple submission
    if (loading) return;
    try {
      setLoading(true);
      let data;
      if (userID) {
        // Add creditUserID to the form
        data = await edit_credit_user(form, userID);
      } else {
        data = await create_credit_user(form);
      }

      if (data.success) {
        setAlert({
          open: true,
          message: "Success",
          description: data.message,
          variant: "default",
        });
        router.push("/admin/credit_users/all_users");
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

  const handleFileUploadTenderDocument = async (file: any, name: string) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const data = await upload_file(formData);
        if (data.success) {
          setForm((prev) => ({
            ...prev,
            [name]: data.data.filePath, // Assuming file.name is the key in the form state
          }));
        } else {
          setAlert({
            open: true,
            message: "Error",
            description: data.message,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.log(error);
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
              <Link
                className="font-medium"
                href="/admin/credit_users/all_users"
              >
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
                  handleChange={(e) => {
                    handleChange(e.target.value, "fullName");
                  }}
                  value={form.fullName}
                  error={formErrors.fullName ? formErrors.fullName : ""}
                  required
                />
                <Select
                  label="Gender"
                  items={userConstants.Gender}
                  defaultValue=""
                  placeholder="Select gender"
                  handleChange={(e) => {
                    handleChange(e.target.value, "gender");
                  }}
                  value={form.gender}
                  error={formErrors.gender ? formErrors.gender : ""}
                  required
                />
                <InputGroup
                  label="NIC"
                  placeholder="NIC"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "nic");
                  }}
                  value={form.nic}
                  error={formErrors.nic ? formErrors.nic : ""}
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

                <Select
                  label="Marital Status"
                  items={userConstants.MaritalStatus}
                  defaultValue=""
                  placeholder="Select marital status"
                  handleChange={(e) => {
                    handleChange(e.target.value, "maritalState");
                  }}
                  value={form.maritalState}
                  error={formErrors.maritalState ? formErrors.maritalState : ""}
                  required
                />
              </div>
              <div className="flex flex-col gap-9">
                <InputGroup
                  label="Permanent Address"
                  placeholder="Permanent Address"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "permanentAddress");
                  }}
                  value={form.permanentAddress}
                  error={
                    formErrors.permanentAddress
                      ? formErrors.permanentAddress
                      : ""
                  }
                  required
                />
                <InputGroup
                  label="Birthday"
                  placeholder="Birthday"
                  type="date"
                  handleChange={(e) => {
                    handleChange(e.target.value, "birthday");
                  }}
                  value={form.birthday}
                  error={formErrors.birthday ? formErrors.birthday : ""}
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

                <InputGroup
                  className="mt-1"
                  label="Email Address"
                  placeholder="Email Address"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "email");
                  }}
                  value={form.email}
                  error={formErrors.email ? formErrors.email : ""}
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <form>
                <div className="mb-4 flex items-center gap-3">
                  {form.profilePicture !== "" && (
                    <div className="cursor-pointer">
                      <img
                        src={`${config.clientUrl + form.profilePicture}`}
                        width={55}
                        height={55}
                        alt="User"
                        className="size-14 rounded-full object-cover"
                        onClick={() => {
                          window.open(
                            config.clientUrl + form.profilePicture,
                            "_blank",
                          );
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <span className="mb-1.5 font-medium text-dark dark:text-white">
                      Profile Picture
                    </span>
                    {form.profilePicture !== "" && (
                      <span className="flex gap-3">
                        <button
                          type="button"
                          className="text-body-sm hover:text-red"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              profilePicture: "", // Assuming file.name is the key in the form state
                            }));
                          }}
                        >
                          Delete
                        </button>
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
                  <input
                    type="file"
                    name="profilePhoto"
                    id="profilePhoto"
                    accept="image/png, image/jpg, image/jpeg"
                    hidden
                    onChange={(e: any) => {
                      handleFileUploadTenderDocument(
                        e.target.files[0],
                        "profilePicture",
                      );
                    }}
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
                  {form.nicBackPicture !== "" && (
                    <div className="cursor-pointer">
                      <img
                        src={`${config.clientUrl + form.nicBackPicture}`}
                        width={55}
                        height={55}
                        alt="User"
                        className="size-14 rounded-full object-cover"
                        onClick={() => {
                          window.open(
                            config.clientUrl + form.nicBackPicture,
                            "_blank",
                          );
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <span className="mb-1.5 font-medium text-dark dark:text-white">
                      NIC back
                    </span>
                    {form.nicBackPicture !== "" && (
                      <span className="flex gap-3">
                        <button
                          type="button"
                          className="text-body-sm hover:text-red"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              nicBackPicture: "", // Assuming file.name is the key in the form state
                            }));
                          }}
                        >
                          Delete
                        </button>
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
                  <input
                    type="file"
                    name="nicBackPhoto"
                    id="nicBackPhoto"
                    accept="image/png, image/jpg, image/jpeg"
                    hidden
                    onChange={(e: any) => {
                      handleFileUploadTenderDocument(
                        e.target.files[0],
                        "nicBackPicture",
                      );
                    }}
                  />

                  <label
                    htmlFor="nicBackPhoto"
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
                  {form.nicFrontPicture !== "" && (
                    <div className="cursor-pointer">
                      <img
                        src={`${config.clientUrl + form.nicFrontPicture}`}
                        width={55}
                        height={55}
                        alt="User"
                        className="size-14 rounded-full object-cover"
                        onClick={() => {
                          window.open(
                            config.clientUrl + form.nicFrontPicture,
                            "_blank",
                          );
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <span className="mb-1.5 font-medium text-dark dark:text-white">
                      NIC front
                    </span>

                    {form.nicFrontPicture !== "" && (
                      <span className="flex gap-3">
                        <button
                          type="button"
                          className="text-body-sm hover:text-red"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              nicFrontPicture: "", // Assuming file.name is the key in the form state
                            }));
                          }}
                        >
                          Delete
                        </button>
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
                  <input
                    type="file"
                    name="nicFrontPhoto"
                    id="nicFrontPhoto"
                    accept="image/png, image/jpg, image/jpeg"
                    hidden
                    onChange={(e: any) => {
                      handleFileUploadTenderDocument(
                        e.target.files[0],
                        "nicFrontPicture",
                      );
                    }}
                  />

                  <label
                    htmlFor="nicFrontPhoto"
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
                  {form.locationCertificationPicture !== "" && (
                    <div className="cursor-pointer">
                      <img
                        src={`${config.clientUrl + form.locationCertificationPicture}`}
                        width={55}
                        height={55}
                        alt="User"
                        className="size-14 rounded-full object-cover"
                        onClick={() => {
                          window.open(
                            config.clientUrl +
                              form.locationCertificationPicture,
                            "_blank",
                          );
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <span className="mb-1.5 font-medium text-dark dark:text-white">
                      Location certification
                    </span>
                    {form.locationCertificationPicture !== "" && (
                      <span className="flex gap-3">
                        <button
                          type="button"
                          className="text-body-sm hover:text-red"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              locationCertificationPicture: "", // Assuming file.name is the key in the form state
                            }));
                          }}
                        >
                          Delete
                        </button>
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
                  <input
                    type="file"
                    name="locationCertificationPhoto"
                    id="locationCertificationPhoto"
                    accept="image/png, image/jpg, image/jpeg"
                    hidden
                    onChange={(e: any) => {
                      handleFileUploadTenderDocument(
                        e.target.files[0],
                        "locationCertificationPicture",
                      );
                    }}
                  />

                  <label
                    htmlFor="locationCertificationPhoto"
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

            <div className="flex justify-end gap-3">
              <button
                className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                type="button"
                onClick={() => {
                  router.push("/admin/credit_users/all_users");
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

export default AddUserComponent;
