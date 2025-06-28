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
import React, { useEffect, useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import InputGroup from "@/components/FormElements/InputGroup";
import { useSearchParams } from "next/navigation";
import { get_loan_by_id, update_installment } from "@/routes/loan/loanRoutes";
import { config } from "@/config";
import { Loader } from "@/components/Loader/Loader";
import { loanConstants } from "@/constants/loan_constants";
import DropDownMenuComponent from "@/components/DropDownMenuComponent/DropDownMenuComponent";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";

// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};
type loanInstallmentsHistoryObject = {
  installmentNo: number;
  installmentAmount: number;
  installmentDate: number;
  paidDate: Date;
  status: string;
  approvedBy: string;
};

type Loan = {
  ID: string;
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
  loanInstallmentsHistory: loanInstallmentsHistoryObject[];
  loanStatus: string;
  nextInstallmentDate: Date;
};

const UpdateLoanComponent = () => {
  const router = useRouter();
  const [openAddRecordDialog, setOpenAddRecordDialog] = useState(false);
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
  const [selectedInstallmentNo, setSelectedInstallmentNo] = React.useState<
    number | null
  >(null);
  const [openCompleteInstallmentModel, setOpenCompleteInstallmentModel] =
    useState(false);
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

  const handleOpenAddRecordDialog = () => {
    setOpenAddRecordDialog(true);
  };
  const handleCloseAddRecordDialog = () => {
    setOpenAddRecordDialog(false);
  };

  // complete installment function
  const completeInstallment = async () => {
    // prevent multiple clicks
    if (!selectedInstallmentNo) return;
    if (!loanData) return;
    try {
      setLoading(true);
      const response = await update_installment({
        loanID: loanData.ID,
        installmentNo: selectedInstallmentNo,
      });
      if (response.success) {
        setAlert({
          open: true,
          message: "Success",
          description: "Loan updated successfully",
          variant: "default",
        });
        fetchLoanData();
        setSelectedInstallmentNo(null);
        setOpenCompleteInstallmentModel(false);
      } else {
        setAlert({
          open: true,
          message: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Error",
        description: "Error approving loan",
        variant: "destructive",
      });
    } finally {
      setSelectedInstallmentNo(null);
      setOpenCompleteInstallmentModel(false);
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
              <Link className="font-medium" href="/admin/loan_details/ongoing_loans">
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
                  <p
                    className="cursor-pointer text-sm text-muted-foreground"
                    onClick={() => {
                      router.push(
                        `/admin/loan_details/detail_view?loanID=${loanData?.ID}`,
                      );
                    }}
                  >
                    {loanData?.ID}
                  </p>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Team ID
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loanData?.teamID}
                  </p>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Applicant Name
                  </p>
                  <p
                    className="cursor-pointer text-sm text-muted-foreground"
                    onClick={() => {
                      router.push(`/admin/credit_users/all_users/profile?userID=${loanData?.applicantID}`);
                    }}
                  >
                    {loanData?.applicantFullName}
                  </p>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-[25px_1fr] items-start">
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-dark dark:text-white">
                    Next Installment Date
                  </p>
                  <p
                    className="cursor-pointer text-sm text-muted-foreground"
                  >
                    {loanData?.nextInstallmentDate?.toString().slice(0, 10)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead>Installment no</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Instalment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid date</TableHead>
              <TableHead>Approved by</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loanData?.loanInstallmentsHistory.map((item, index) => (
              <TableRow
                key={index}
                className="border-[#eee] dark:border-dark-3"
              >
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.installmentNo}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.installmentDate.toString().slice(0, 10)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.installmentAmount}
                  </p>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                      {
                        "bg-[#219653]/[0.08] text-[#dfe231]":
                          item.status ===
                          loanConstants.installmentStatus.pending,
                        "bg-[#219653]/[0.08] text-[#219653]":
                          item.status === loanConstants.installmentStatus.paid,
                        "bg-[#219653]/[0.08] text-[#180ea5]":
                          item.status ===
                          loanConstants.installmentStatus.rejected,
                        "bg-[#D34053]/[0.08] text-[#D34053]":
                          item.status ===
                          loanConstants.installmentStatus.overdue,
                      },
                    )}
                  >
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).toLowerCase()}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.paidDate
                      ? item.paidDate.toString().slice(0, 10)
                      : "Not Paid"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.approvedBy}
                  </p>
                </TableCell>

                <TableCell className="xl:pr-7.5">
                  <div
                    className="flex cursor-pointer items-center justify-end gap-x-3.5"
                    onClick={() => {
                      setSelectedInstallmentNo(item.installmentNo);
                    }}
                  >
                    <DropDownMenuComponent
                      options={[
                        {
                          label: "View loan",
                          value: () => {
                            router.push(
                              `/admin/loan_details/detail_view?loanID=${loanData.ID}`,
                            );
                          },
                        },
                        ...(item.status === loanConstants.status.pending
                          ? [
                              {
                                label: "Complete installment",
                                value: () => {
                                  setOpenCompleteInstallmentModel(true);
                                },
                              },
                            ]
                          : []),
                      ]}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* delete loan */}
      <ConfirmationDialog
        isOpen={openCompleteInstallmentModel}
        title="Complete Installment"
        description="Are you sure you want to complete this installment?"
        onCancel={() => setOpenCompleteInstallmentModel(false)}
        isSaveButton={true}
        onSubmit={() => {
          completeInstallment();
          setOpenCompleteInstallmentModel(false);
        }}
      />
    </>
  );
};

export default UpdateLoanComponent;
