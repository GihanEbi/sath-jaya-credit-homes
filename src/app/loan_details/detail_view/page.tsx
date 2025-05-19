"use client";

import { useRouter } from "next/navigation";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const loanData = {
  branchName: "Kaluthara",
  centerNo: "CN00001",
  memberNo: "CUS00001",
  teamNo: "UG00001",
  applicantName: "Don Maniwelge Gihan Piumal Alwis",
  nameOfMainIncomePersonOfFamily: "Don Maniwelge Gamini Alwis",
  phoneNoOfMainIncomePersonOfFamily: "0776603689",
  monthlyFamilyIncomeOFApplicant: "50000",
  doYouGetAnyLoanFromOtherOrganization: "Yes",
  loanAmount: "15000",
  balanceLoanAmount: "7000",
  purposeOfLoan:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus ultricies. Sed vel aliquet libero. Nunc a augue fermentum, pharetra ligula sed, aliquam lacus.",
  nicOfMainIncomePerson: "701245152v",
  relationship: "Father",
  organizationName: "JIT",
  instalment: "3000",
  homeLocation: "google link",
  shearedApplicantFullName: "Don Maniwelge Gayan Lakmal Alwis",
  shearedApplicantNic: "921345125v",
  shearedApplicantPhone: "0702516439",
  shearedApplicantMaritalStatus: "Unmarried",
  shearedApplicantAddress: "No-337, perera road, alibomulla",
  shearedApplicantBirthday: "1992-12-17",
  guarantor1: "Suranga Kalum",
  guarantor2: "Sujeewa Nelum",
  guarantor3: "Kasun Perera",
};

const LoanDetails = () => {
  const router = useRouter();
  return (
    <div className="mx-auto w-full max-w-[970px]">
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
                  <p className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-sm">
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
                    Center No
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {loanData?.centerNo}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Team No
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {loanData?.teamNo}
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
                    className="text-muted-foreground cursor-pointer text-sm"
                    onClick={() => {
                      router.push("/credit_users/all_users/profile");
                    }}
                  >
                    {loanData?.applicantName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Name of main income person of the family
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {loanData?.nameOfMainIncomePersonOfFamily}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Phone Number of main income person of the family
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {loanData?.phoneNoOfMainIncomePersonOfFamily}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Monthly family income of the applicant
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {loanData?.monthlyFamilyIncomeOFApplicant}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Do you get any loan before any other organization
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {loanData?.doYouGetAnyLoanFromOtherOrganization}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Loan Amount
                  </p>
                  <p className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-sm">
                    {loanData?.balanceLoanAmount}
                  </p>
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
                  <p className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-sm">
                    {loanData?.nicOfMainIncomePerson}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Relationship
                  </p>
                  <p className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-sm">
                    {loanData?.organizationName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Instalment
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {loanData?.instalment}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Home location google map link
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {loanData?.homeLocation}
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
                  <p className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-sm">
                    {loanData?.shearedApplicantPhone}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Sheared applicant marital status
                  </p>
                  <p className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-sm">
                    {loanData?.guarantor1}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Guarantor 2 Name
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {loanData?.guarantor2}
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
                  <p className="text-muted-foreground text-sm">
                    {loanData?.guarantor3}
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

export default LoanDetails;
