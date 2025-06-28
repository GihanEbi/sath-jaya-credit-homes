"use client";

import { useRouter } from "next/navigation";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loader } from "@/components/Loader/Loader";
import { AlertDialogDemo } from "@/components/AlertDialog/AlertDialog";
import { userConstants } from "@/constants/user_constants";
import { useSearchParams } from "next/navigation";
import { get_loan_by_id } from "@/routes/loan/loanRoutes";
import { config } from "@/config";

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
  applicantFullName: string;
  guarantorFullName1: string;
  guarantorFullName2: string;
  guarantorFullName3: string;
};

type users = {
  label: string;
  value: string;
};

const LoanDetailsComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loanID = searchParams.get("loanID");
  // --------- alert for success and error messages ---------
  const [alert, setAlert] = React.useState<Alert>({
    open: false,
    message: "",
    description: "",
    variant: "default",
  });
  // --------- state for loading spinner ---------
  const [loading, setLoading] = React.useState(false);
  const [loanData, setLoanData] = React.useState<Loan | null>(null);
  // --------- first render to get users data ---------
  useEffect(() => {
    fetchLoanData();
  }, []);

  // --------- function to get users data ---------
  const fetchLoanData = async () => {
    try {
      setLoading(true);

      const data = await get_loan_by_id(loanID);
      if (data.success) {
        setLoanData(data.Details);
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

  return (
    <div className="mx-auto w-full max-w-[970px]">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-dark/50">
          <Loader />
        </div>
      )}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          Loan Details
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" href="/">
                Dashboard /
              </Link>
            </li>
            <li>
              <Link className="font-medium" href="/loan_details/all_loans">
                All Loans /
              </Link>
            </li>
            <li className="font-medium text-primary">Loan Details</li>
          </ol>
        </nav>
      </div>
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <ShowcaseSection title="Loan Details" className="space-y-5.5 !p-6.5">
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Branch Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.branchName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Member No
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.memberNo}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Center Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.centerName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Team No
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.teamID}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================== applicant details ========================= */}
          <div className="relative">
            <div className="mb-3">Applicant Details</div>
            <div className="mt-0 h-px w-full bg-gray-300"></div>
          </div>
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Applicant Name
                  </p>
                  <p
                    className="cursor-pointer text-sm text-muted-foreground"
                    onClick={() => {
                      router.push(
                        `/admin/credit_users/all_users/profile?userID=${loanData?.applicantID}`,
                      );
                    }}
                  >
                    {loanData?.applicantFullName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Name of main income person of the family
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.mainIncomePerson}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Phone Number of main income person of the family
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.mainIncomePersonPhoneNo}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Monthly family income of the applicant
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.monthlyFamilyIncome}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Do you get any loan before any other organization
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.loanBefore ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Loan Amount
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.loanAmount}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Balance loan amount
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.balanceLoanAmount}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Home location google map link
                  </p>
                  <div>
                    {loanData?.homeLocation ? (
                      <img
                        src={`${config.clientUrl + loanData?.homeLocation}`}
                        width={200}
                        height={200}
                        alt="User"
                        className="mt-5 cursor-pointer"
                        onClick={() => {
                          window.open(
                            config.clientUrl + loanData?.homeLocation,
                            "_blank",
                          );
                        }}
                      />
                    ) : (
                      <p>No data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Purpose of the loan
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.purposeOfLoan}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    NIC of main income person
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.mainIncomePersonNic}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Relationship
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.relationship}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Organization Name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.loanOrganization
                      ? loanData?.loanOrganization
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Instalment
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.installment}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================== Sheared applicant details ========================= */}
          <div className="relative">
            <div className="mb-3">Sheared Applicant Details</div>
            <div className="mt-0 h-px w-full bg-gray-300"></div>
          </div>
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Sheared applicant full name
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.shearedApplicantFullName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Sheared applicant NIC
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.shearedApplicantNic}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Sheared applicant phone no
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.shearedApplicantPhoneNo}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Sheared applicant marital status
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.shearedApplicantMaritalStatus}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Sheared applicant address
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.shearedApplicantAddress}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Sheared applicant Birthday
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.shearedApplicantBirthday}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================== Guarantors details ========================= */}
          <div className="relative">
            <div className="mb-3">Guarantors Details</div>
            <div className="mt-0 h-px w-full bg-gray-300"></div>
          </div>
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Guarantor 1 Name
                  </p>
                  <p
                    className="cursor-pointer text-sm text-muted-foreground"
                    onClick={() => {
                      router.push(
                        `/admin/credit_users/all_users/profile?userID=${loanData?.guarantorID1}`,
                      );
                    }}
                  >
                    {loanData?.guarantorFullName1}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Guarantor 2 Name
                  </p>
                  <p
                    className="cursor-pointer text-sm text-muted-foreground"
                    onClick={() => {
                      router.push(
                        `/admin/credit_users/all_users/profile?userID=${loanData?.guarantorID2}`,
                      );
                    }}
                  >
                    {loanData?.guarantorFullName2}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-9">
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Guarantor 3 Name
                  </p>
                  <p
                    className="cursor-pointer text-sm text-muted-foreground"
                    onClick={() => {
                      router.push(
                        `/admin/credit_users/all_users/profile?userID=${loanData?.guarantorID3}`,
                      );
                    }}
                  >
                    {loanData?.guarantorFullName3}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ShowcaseSection>
      </div>
    </div>
  );
};

export default LoanDetailsComponent;
