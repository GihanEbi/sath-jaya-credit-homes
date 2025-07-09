"use client";

import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Link from "next/link";
import React, { useState } from "react";
import { Select } from "@/components/FormElements/select";
import { upload_file } from "@/routes/upload/uploadRoutes";
import { config } from "@/config";
import { Loader } from "@/components/Loader/Loader";
import { AlertDialogDemo } from "@/components/AlertDialog/AlertDialog";
import { useSearchParams } from "next/navigation";
import {
  create_loan,
  edit_loan,
  get_loan_by_id,
} from "@/routes/loan/loanRoutes";
import { set } from "mongoose";
import { validation, validationProperty } from "@/services/schemaValidation";
import { LoanSchema } from "../../../../../lib/schemas";
import { get_credit_users_without_pagination } from "@/routes/credit-user/creditUserRoute";
import { UploadIcon } from "@/assets/icons";
import {
  get_credit_user_group_by_id,
  get_credit_user_groups_without_pagination,
} from "@/routes/credit_user_groups/creditUserGroupRoutes";
import { userConstants } from "@/constants/user_constants";

// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

type Loan = {
  branchName: string;
  centerName: string;
  memberNo: string;
  teamID: string;
  applicantID: string;
  purposeOfLoan: string;
  mainIncomePerson: string;
  mainIncomePersonPhoneNo: string;
  mainIncomePersonNic: string;
  monthlyFamilyIncome: number;
  relationship: string;
  loanBefore: boolean;
  loanOrganization: string;
  loanAmount: number;
  installment: number;
  balanceLoanAmount: number;
  homeLocation: string;
  shearedApplicantFullName: string;
  shearedApplicantAddress: string;
  shearedApplicantPhoneNo: string;
  shearedApplicantNic: string;
  shearedApplicantBirthday: string; // Assuming this is a date field
  shearedApplicantMaritalStatus: string; // Assuming this is a string field
  guarantorID1: string;
  guarantorID2: string;
  guarantorID3?: string;
};

type users = {
  label: string;
  value: string;
};

const NewLoanComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = React.useState<Loan>({
    branchName: "",
    centerName: "",
    memberNo: "",
    teamID: "",
    applicantID: "",
    purposeOfLoan: "",
    mainIncomePerson: "",
    mainIncomePersonPhoneNo: "",
    mainIncomePersonNic: "",
    monthlyFamilyIncome: 0,
    relationship: "",
    loanBefore: false,
    loanOrganization: "",
    loanAmount: 0,
    installment: 0,
    balanceLoanAmount: 0,
    homeLocation: "",
    shearedApplicantFullName: "",
    shearedApplicantAddress: "",
    shearedApplicantPhoneNo: "",
    shearedApplicantNic: "",
    shearedApplicantBirthday: "", // Assuming this is a date field
    shearedApplicantMaritalStatus: "", // Assuming this is a string field
    guarantorID1: "",
    guarantorID2: "",
    guarantorID3: "",
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
  // --------- state for user ---------
  const [user, setUser] = useState<users[]>([]);
  // --------- state for team users ---------
  const [teamUsers, setTeamUsers] = useState<users[]>([]);
  const [teams, serTeams] = useState<users[]>([]);

  // --------- get loanID from query params if exists ---------
  const loanID = searchParams.get("loanID");
  // --------- if loanID exists, fetch loan details and set form state ---------
  React.useEffect(() => {
    if (loanID) {
      fetchLoanData(loanID);
    }
    fetchUserGroups();
  }, [loanID]);

  // --------- fetch users ---------
  const fetchUserGroups = async () => {
    try {
      setLoading(true);
      const data = await get_credit_user_groups_without_pagination();
      if (data.success) {
        serTeams(data.Details);
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

  // --------- function to get loan data ---------
  const fetchLoanData = async (loanID: string | null) => {
    if (!loanID) return;

    try {
      setLoading(true);

      const data = await get_loan_by_id(loanID);

      if (data.success) {
        fetchTeamUsers(data.Details.teamID);
        setForm({
          branchName: data.Details.branchName,
          centerName: data.Details.centerName,
          memberNo: data.Details.memberNo,
          teamID: data.Details.teamID,
          applicantID: data.Details.applicantID,
          purposeOfLoan: data.Details.purposeOfLoan,
          mainIncomePerson: data.Details.mainIncomePerson,
          mainIncomePersonPhoneNo: data.Details.mainIncomePersonPhoneNo,
          mainIncomePersonNic: data.Details.mainIncomePersonNic,
          monthlyFamilyIncome: data.Details.monthlyFamilyIncome,
          relationship: data.Details.relationship,
          loanBefore: data.Details.loanBefore,
          loanOrganization: data.Details.loanOrganization || "",
          loanAmount: data.Details.loanAmount,
          installment: data.Details.installment,
          balanceLoanAmount: data.Details.balanceLoanAmount,
          homeLocation: data.Details.homeLocation,
          shearedApplicantFullName: data.Details.shearedApplicantFullName,
          shearedApplicantAddress: data.Details.shearedApplicantAddress,
          shearedApplicantPhoneNo: data.Details.shearedApplicantPhoneNo,
          shearedApplicantNic: data.Details.shearedApplicantNic,
          shearedApplicantBirthday: data.Details.shearedApplicantBirthday,
          shearedApplicantMaritalStatus:
            data.Details.shearedApplicantMaritalStatus,
          guarantorID1: data.Details.guarantorID1,
          guarantorID2: data.Details.guarantorID2,
          guarantorID3: data.Details.guarantorID3,
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

  // -------- function to get team users after selecting the team id
  const fetchTeamUsers = async (teamId: string) => {
    try {
      setLoading(true);
      const data = await get_credit_user_group_by_id(teamId);
      if (data.success) {
        let tempList: users[] = [];
        tempList.push({
          label: data.Details.leader.fullName,
          value: data.Details.leader.ID,
        });
        for (let memberKey in data.Details.members) {
          const member = data.Details.members[memberKey];
          tempList.push({ label: member.fullName, value: member.ID });
        }
        console.log(tempList);

        setTeamUsers(tempList);
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
    console.log(`Field: ${name}, Value: ${value}`);
    
    setForm((prev) => ({ ...prev, [name]: value }));

    const errorMessage = validationProperty(LoanSchema, name, value) as string;

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

  // -------- handleSubmit for form submission ---------
  const handleSubmit = async () => {
    // -------- check full form validation
    let checkForm = validation(LoanSchema, form);
    console.log(checkForm);

    if (checkForm !== null) {
      setFormErrors(checkForm);
      return;
    }
    // -------- prevent multiple submission
    if (loading) return;
    try {
      setLoading(true);
      let data;
      if (loanID) {
        // Add creditUserID to the form
        data = await edit_loan(form, loanID);
      } else {
        data = await create_loan(form);
      }

      if (data.success) {
        setAlert({
          open: true,
          message: "Success",
          description: data.message,
          variant: "default",
        });
        router.push("/admin/loan_details/all_loans");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-dark/50">
          <Loader />
        </div>
      )}
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
              handleChange={(e) => {
                handleChange(e.target.value, "branchName");
              }}
              value={form.branchName}
              error={formErrors.branchName ? formErrors.branchName : ""}
              required
            />
            <InputGroup
              label="Center Number"
              placeholder="Center Number"
              type="text"
              handleChange={(e) => {
                handleChange(e.target.value, "centerName");
              }}
              value={form.centerName}
              error={formErrors.centerName ? formErrors.centerName : ""}
              required
            />
            <InputGroup
              label="Member Number"
              placeholder="Member Number"
              type="text"
              handleChange={(e) => {
                handleChange(e.target.value, "memberNo");
              }}
              value={form.memberNo}
              error={formErrors.memberNo ? formErrors.memberNo : ""}
              required
            />
            <Select
              label="Team Number"
              items={teams}
              defaultValue=""
              placeholder="Team Number"
              handleChange={(e) => {
                fetchTeamUsers(e.target.value);
                handleChange(e.target.value, "teamID");
              }}
              value={form.teamID}
              error={formErrors.teamID ? formErrors.teamID : ""}
              required
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
                  items={teamUsers}
                  defaultValue=""
                  placeholder="Select Applicant"
                  handleChange={(e) => {
                    handleChange(e.target.value, "applicantID");
                  }}
                  value={form.applicantID}
                  error={formErrors.applicantID ? formErrors.applicantID : ""}
                  required
                />
                <InputGroup
                  label="Name of main income person of the family"
                  placeholder="Name of main income person of the family"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "mainIncomePerson");
                  }}
                  value={form.mainIncomePerson}
                  error={
                    formErrors.mainIncomePerson
                      ? formErrors.mainIncomePerson
                      : ""
                  }
                  required
                />
                <InputGroup
                  label="Phone Number of main income person of the family"
                  placeholder="Phone Number of main income person of the family"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "mainIncomePersonPhoneNo");
                  }}
                  value={form.mainIncomePersonPhoneNo}
                  error={
                    formErrors.mainIncomePersonPhoneNo
                      ? formErrors.mainIncomePersonPhoneNo
                      : ""
                  }
                  required
                />
                <InputGroup
                  label="Monthly family income of the applicant"
                  placeholder="Monthly family income of the applicant"
                  type="number"
                  handleChange={(e) => {
                    handleChange(e.target.value, "monthlyFamilyIncome");
                  }}
                  value={form.monthlyFamilyIncome}
                  error={
                    formErrors.monthlyFamilyIncome
                      ? formErrors.monthlyFamilyIncome
                      : ""
                  }
                  required
                />
                <Select
                  label="Do you get any loan before any other organization"
                  items={userConstants.LoanBefore}
                  defaultValue={false}
                  handleChange={(e) => {
                    handleChange(e.target.value, "loanBefore");
                  }}
                  value={form.loanBefore}
                  error={
                    formErrors.loanBefore
                      ? formErrors.loanBefore
                      : ""
                  }
                  required
                />
                <InputGroup
                  label="Loan Amount"
                  placeholder="Loan Amount"
                  type="number"
                  handleChange={(e) => {
                    handleChange(e.target.value, "loanAmount");
                  }}
                  value={form.loanAmount}
                  error={formErrors.loanAmount ? formErrors.loanAmount : ""}
                  required
                />
                <InputGroup
                  label="Balance loan amount"
                  placeholder="Balance loan amount"
                  type="number"
                  handleChange={(e) => {
                    handleChange(e.target.value, "balanceLoanAmount");
                  }}
                  value={form.balanceLoanAmount}
                  error={
                    formErrors.balanceLoanAmount
                      ? formErrors.balanceLoanAmount
                      : ""
                  }
                  required
                />
              </div>
              {/* -------------------- */}
              <div className="flex flex-col gap-9">
                <TextAreaGroup
                  label="Purpose of the loan"
                  placeholder="Purpose of the loan"
                  handleChange={(e) => {
                    handleChange(e.target.value, "purposeOfLoan");
                  }}
                  value={form.purposeOfLoan}
                  error={
                    formErrors.purposeOfLoan ? formErrors.purposeOfLoan : ""
                  }
                  required
                />
                <InputGroup
                  label="NIC of main income person"
                  placeholder="NIC of main income person"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "mainIncomePersonNic");
                  }}
                  value={form.mainIncomePersonNic}
                  error={
                    formErrors.mainIncomePersonNic
                      ? formErrors.mainIncomePersonNic
                      : ""
                  }
                  required
                />
                <InputGroup
                  label="Relationship"
                  placeholder="Relationship"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "relationship");
                  }}
                  value={form.relationship}
                  error={formErrors.relationship ? formErrors.relationship : ""}
                  required
                />
                <InputGroup
                  label="Organization Name"
                  placeholder="Organization Name"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "loanOrganization");
                  }}
                  value={form.loanOrganization}
                  error={
                    formErrors.loanOrganization
                      ? formErrors.loanOrganization
                      : ""
                  }
                  required
                />
                <InputGroup
                  label="Instalment"
                  placeholder="Instalment"
                  type="number"
                  handleChange={(e) => {
                    handleChange(e.target.value, "installment");
                  }}
                  value={form.installment}
                  error={formErrors.installment ? formErrors.installment : ""}
                  required
                />
                {/* <InputGroup
                  label="Home location image"
                  placeholder="Home location google map link"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "homeLocation");
                  }}
                  value={form.homeLocation}
                  error={formErrors.homeLocation ? formErrors.homeLocation : ""}
                  required
                /> */}

                <form>
                  <div className="mb-4 flex items-center gap-3">
                    {form.homeLocation !== "" && (
                      <div className="cursor-pointer">
                        <img
                          src={`${config.clientUrl + form.homeLocation}`}
                          width={55}
                          height={55}
                          alt="User"
                          className="size-14 rounded-full object-cover"
                          onClick={() => {
                            window.open(
                              config.clientUrl + form.homeLocation,
                              "_blank",
                            );
                          }}
                        />
                      </div>
                    )}

                    <div>
                      <span className="mb-1.5 font-medium text-dark dark:text-white">
                        Home location image
                      </span>

                      {form.homeLocation !== "" && (
                        <span className="flex gap-3">
                          <button
                            type="button"
                            className="text-body-sm hover:text-red"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                homeLocation: "", // Assuming file.name is the key in the form state
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
                      name="homeLocationImg"
                      id="homeLocationImg"
                      accept="image/png, image/jpg, image/jpeg"
                      hidden
                      onChange={(e: any) => {
                        handleFileUploadTenderDocument(
                          e.target.files[0],
                          "homeLocation",
                        );
                      }}
                    />

                    <label
                      htmlFor="homeLocationImg"
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
                  handleChange={(e) => {
                    handleChange(e.target.value, "shearedApplicantFullName");
                  }}
                  value={form.shearedApplicantFullName}
                  error={
                    formErrors.shearedApplicantFullName
                      ? formErrors.shearedApplicantFullName
                      : ""
                  }
                  required
                />
                <InputGroup
                  label="Sheared applicant NIC"
                  placeholder="Sheared applicant NIC"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "shearedApplicantNic");
                  }}
                  value={form.shearedApplicantNic}
                  error={
                    formErrors.shearedApplicantNic
                      ? formErrors.shearedApplicantNic
                      : ""
                  }
                  required
                />
                <InputGroup
                  label="Sheared applicant phone no"
                  placeholder="Sheared applicant phone no"
                  type="text"
                  handleChange={(e) => {
                    handleChange(e.target.value, "shearedApplicantPhoneNo");
                  }}
                  value={form.shearedApplicantPhoneNo}
                  error={
                    formErrors.shearedApplicantPhoneNo
                      ? formErrors.shearedApplicantPhoneNo
                      : ""
                  }
                  required
                />
                <Select
                  label="Sheared applicant marital status"
                  items={userConstants.MaritalStatus}
                  defaultValue=""
                  handleChange={(e) => {
                    handleChange(
                      e.target.value,
                      "shearedApplicantMaritalStatus",
                    );
                  }}
                  value={form.shearedApplicantMaritalStatus}
                  error={
                    formErrors.shearedApplicantMaritalStatus
                      ? formErrors.shearedApplicantMaritalStatus
                      : ""
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-9">
                <TextAreaGroup
                  label="Sheared applicant address"
                  placeholder="Sheared applicant address"
                  handleChange={(e) => {
                    handleChange(e.target.value, "shearedApplicantAddress");
                  }}
                  value={form.shearedApplicantAddress}
                  error={
                    formErrors.shearedApplicantAddress
                      ? formErrors.shearedApplicantAddress
                      : ""
                  }
                  required
                />
                <InputGroup
                  label="Sheared applicant Birthday"
                  placeholder="Sheared applicant Birthday"
                  type="date"
                  handleChange={(e) => {
                    handleChange(e.target.value, "shearedApplicantBirthday");
                  }}
                  value={form.shearedApplicantBirthday}
                  error={
                    formErrors.shearedApplicantBirthday
                      ? formErrors.shearedApplicantBirthday
                      : ""
                  }
                  required
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
                  items={teamUsers}
                  defaultValue=""
                  placeholder="Select guarantor 1"
                  handleChange={(e) => {
                    handleChange(e.target.value, "guarantorID1");
                  }}
                  value={form.guarantorID1}
                  error={formErrors.guarantorID1 ? formErrors.guarantorID1 : ""}
                  required
                />
                <Select
                  label="Guarantor 3 Name"
                  items={teamUsers}
                  defaultValue=""
                  placeholder="Select guarantor 3"
                  handleChange={(e) => {
                    handleChange(e.target.value, "guarantorID3");
                  }}
                  value={form.guarantorID3}
                  error={formErrors.guarantorID3 ? formErrors.guarantorID3 : ""}
                />
              </div>
              <div className="flex flex-col gap-9">
                <Select
                  label="Guarantor 2 Name"
                  items={teamUsers}
                  defaultValue=""
                  placeholder="Select guarantor 2"
                  handleChange={(e) => {
                    handleChange(e.target.value, "guarantorID2");
                  }}
                  value={form.guarantorID2}
                  error={formErrors.guarantorID2 ? formErrors.guarantorID2 : ""}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                type="button"
                onClick={() => {
                  router.push("/admin/loan_details/all_loans");
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

export default NewLoanComponent;
