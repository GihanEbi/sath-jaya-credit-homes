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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import InputGroup from "@/components/FormElements/InputGroup";

const tempData = [
  {
    date: "2025-05-03",
    instalment: "1650",
    paidAmount: "3500",
    balanceAmount: "16500",
  },
  {
    date: "2025-05-03",
    instalment: "1650",
    paidAmount: "3500",
    balanceAmount: "16500",
  },
  {
    date: "2025-05-03",
    instalment: "1650",
    paidAmount: "3500",
    balanceAmount: "16500",
  },
  {
    date: "2025-05-03",
    instalment: "1650",
    paidAmount: "3500",
    balanceAmount: "16500",
  },
];

const UpdateLoan = () => {
  const router = useRouter();
  const [openAddRecordDialog, setOpenAddRecordDialog] = useState(false);

  const handleOpenAddRecordDialog = () => {
    setOpenAddRecordDialog(true);
  };
  const handleCloseAddRecordDialog = () => {
    setOpenAddRecordDialog(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          Update Ongoing Loans
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" href="/">
                Dashboard /
              </Link>
            </li>
            <li>
              <Link className="font-medium" href="/loan_details/ongoing_loans">
                Ongoing Loans /
              </Link>
            </li>
            <li className="font-medium text-primary">Update Ongoing Loans</li>
          </ol>
        </nav>
      </div>
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            <div className="mb-3">
              <div className="mb-3 grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Loan ID
                  </p>
                  <p className="cursor-pointer text-muted-foreground text-sm" onClick={() => {
                      router.push("/loan_details/detail_view");
                    }}>LON00001</p>
                </div>
                
              </div>
              <div className="mb-3 grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Team ID
                  </p>
                  <p className="text-muted-foreground text-sm">CUT00001</p>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Applicant Name
                  </p>
                  <p
                    className="cursor-pointer text-muted-foreground text-sm"
                    onClick={() => {
                      router.push("/credit_users/all_users/profile");
                    }}
                  >
                    Don Maniwelge Gihan Piumal Alwis
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end gap-9">
            <div className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
              <button
                className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                onClick={() => {
                  handleOpenAddRecordDialog();
                }}
              >
                Add New Record
              </button>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead>Date</TableHead>
              <TableHead>Instalment</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Balance Amount</TableHead>
              <TableHead>Actions</TableHead>
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
                    {item.date}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.instalment}
                  </p>
                </TableCell>
                <TableCell
                  className="cursor-pointer"
                  onClick={() => {
                    router.push("/credit_users/all_users/profile");
                  }}
                >
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.paidAmount}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.balanceAmount}
                  </p>
                </TableCell>

                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-x-3.5">
                    <button
                      className="hover:text-primary"
                      onClick={() => {
                        // router.push("/loan_details/detail_view");
                      }}
                    >
                      <span className="sr-only">Edit Detail</span>
                      <TrashIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* add record dialog */}

        <Dialog open={openAddRecordDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Record</DialogTitle>
              <InputGroup
                label="Date"
                placeholder="Date"
                type="text"
                handleChange={handleChange}
              />
              <InputGroup
                label="Instalment"
                placeholder="Instalment"
                type="text"
                handleChange={handleChange}
              />
            </DialogHeader>
            <DialogFooter>
              <div className="flex justify-end gap-3">
                <button
                  className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                  type="button"
                  onClick={() => {
                    handleCloseAddRecordDialog();
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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default UpdateLoan;
