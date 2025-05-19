"use client";

import { useRouter } from "next/navigation";
import { TrashIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const tempData = [
  {
    loanID: "LON00001",
    applicantID: "US00001",
    applicantName: "Don Maniwelge Gihan Piumal alwis",
    nic: "953032190V",
    phoneNO: "0776603689",
    loanAmount: "200000",
    teamID: "CUG00001",
    status: "Active",
  },
  {
    loanID: "LON00001",
    applicantID: "US00001",
    applicantName: "Don Maniwelge Gihan Piumal alwis",
    nic: "953032190V",
    phoneNO: "0776603689",
    loanAmount: "200000",
    teamID: "CUG00001",
    status: "Active",
  },
  {
    loanID: "LON00001",
    applicantID: "US00001",
    applicantName: "Don Maniwelge Gihan Piumal alwis",
    nic: "953032190V",
    phoneNO: "0776603689",
    loanAmount: "200000",
    teamID: "CUG00001",
    status: "Active",
  },
  {
    loanID: "LON00001",
    applicantID: "US00001",
    applicantName: "Don Maniwelge Gihan Piumal alwis",
    nic: "953032190V",
    phoneNO: "0776603689",
    loanAmount: "200000",
    teamID: "CUG00001",
    status: "Active",
  },
];

const AllLoans = () => {
  const router = useRouter();
  return (
    <>
      <Breadcrumb pageName="All Loans" />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          <button
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
            onClick={() => {
              router.push("new_loan");
            }}
          >
            New Loan
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead>Loan ID</TableHead>
              <TableHead>Applicant ID</TableHead>
              <TableHead>Applicant Name</TableHead>
              <TableHead>NIC</TableHead>
              <TableHead>Phone No</TableHead>
              <TableHead>Team ID</TableHead>
              <TableHead>Loan Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tempData.map((item, index) => (
              <TableRow
                key={index}
                className="border-[#eee] dark:border-dark-3"
              >
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.loanID}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.applicantID}
                  </p>
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => {
                    router.push("/credit_users/all_users/profile");
                  }}
                >
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.applicantName}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.nic}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.phoneNO}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.teamID}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.loanAmount}
                  </p>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                      {
                        "bg-[#219653]/[0.08] text-[#219653]":
                          item.status === "Active",
                        "bg-[#D34053]/[0.08] text-[#D34053]":
                          item.status === "Deactivated",
                        //   "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                        //     item.status === "Pending",
                      },
                    )}
                  >
                    {item.status}
                  </div>
                </TableCell>

                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-x-3.5">
                    <button className="hover:text-primary" 
                  onClick={() => {
                    router.push("/loan_details/detail_view");
                  }}>
                      <span className="sr-only">Detail View</span>
                      <TrashIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AllLoans;
