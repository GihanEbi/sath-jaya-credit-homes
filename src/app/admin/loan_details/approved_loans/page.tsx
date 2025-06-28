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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PaginationComponent } from "@/components/Pagination/PaginationComponent";
import { Loader } from "@/components/Loader/Loader";
import React, { useEffect, useState } from "react";
import { AlertDialogDemo } from "@/components/AlertDialog/AlertDialog";
import DropDownMenuComponent from "@/components/DropDownMenuComponent/DropDownMenuComponent";
import {
  delete_loan,
  get_approved_loans,
  get_loans,
  set_reject_to_pending,
  set_to_ongoing_loan,
} from "@/routes/loan/loanRoutes";
import { loanConstants } from "@/constants/loan_constants";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import InputGroup from "@/components/FormElements/InputGroup";
import { set } from "mongoose";

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
  applicantName: string;
  nic: string;
  phoneNO: string;
  loanStatus: string;
  rejectedReason?: string; // Optional field for rejected loans
};
// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

const AllLoans = () => {
  const router = useRouter();
  // --------- alert for success and error messages ---------
  const [alert, setAlert] = React.useState<Alert>({
    open: false,
    message: "",
    description: "",
    variant: "default",
  });
  // --------- state for loading spinner ---------
  const [loading, setLoading] = React.useState(false);
  // --------- state for search value ---------
  const [searchValue, setSearchValue] = React.useState("");
  // --------- state for pagination ---------
  const [pageNo, setPageNo] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [noOfPages, setNoOfPages] = React.useState(0);
  const [noOfRecords, setNoOfRecords] = React.useState(0);
  // ---------- state for store backend data -----------
  const [tableData, setTableData] = React.useState<Loan[]>([]);
  const [openPendingModel, setOpenPendingModel] = React.useState(false);
  const [openDeleteModel, setOpenDeleteModel] = React.useState(false);
  const [reasonForReject, setReasonForReject] = React.useState("");
  const [openViewRejectedReasonModel, setOpenViewRejectedReasonModel] =
    React.useState(false);
  const [selectedLoanID, setSelectedLoanID] = React.useState("");
  const [openSetToOngoingModel, setOpenSetToOngoingModel] =
    React.useState(false);
  const [interestRate, setInterestRate] = React.useState(0);
  const [installmentTime, setInstallmentTime] = React.useState(0);
  const [noOfInstallments, setNoOfInstallments] = React.useState(0);
  const [loanStartingDate, setLoanStartingDate] = React.useState(new Date());
  const [loanSubmissionError, setLoanSubmissionError] = React.useState(false);

  // --------- first render to get users data ---------
  useEffect(() => {
    fetchTableData(pageNo, pageSize, searchValue);
  }, []);

  // --------- function to get table data ---------
  const fetchTableData = async (
    pageNo: number,
    pageSize: number,
    searchValue: string,
  ) => {
    const params = {
      pageNo: pageNo,
      pageSize: pageSize,
    };
    try {
      setLoading(true);

      const data = await get_approved_loans(params, searchValue);
      if (data.success) {
        setTableData(data.response.details);
        setNoOfPages(data.response.noOfPages);
        setNoOfRecords(data.response.noOfRecords);
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
        description: "Error fetching user groups data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // function to approve the loan
  const setLoanStatusToPending = async () => {
    try {
      setLoading(true);
      const response = await set_reject_to_pending({
        loanID: selectedLoanID,
        action: loanConstants.status.pending,
      });
      if (response.success) {
        setAlert({
          open: true,
          message: "Success",
          description: "Loan status set to pending successfully",
          variant: "default",
        });
        fetchTableData(pageNo, pageSize, searchValue);
        setSelectedLoanID("");
        setOpenPendingModel(false);
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
      setOpenPendingModel(false);
      setLoading(false);
    }
  };

  // function to handle submit for set to ongoing loan
  const handleSubmit = async () => {
    // prevent multiple submissions
    if (loading) return;
    if (
      !interestRate ||
      !installmentTime ||
      !loanStartingDate ||
      !noOfInstallments
    ) {
      setLoanSubmissionError(true);
      return;
    }
    try {
      setLoading(true);
      const response = await set_to_ongoing_loan({
        loanID: selectedLoanID,
        action: loanConstants.status.ongoing,
        interestRate: interestRate,
        installmentTime: installmentTime,
        noOfInstallments: noOfInstallments,
        loanStartingDate: loanStartingDate,
      });
      if (response.success) {
        // setAlert({
        //   open: true,
        //   message: "Success",
        //   description: "Loan set to ongoing successfully",
        //   variant: "default",
        // });
        fetchTableData(pageNo, pageSize, searchValue);
        setSelectedLoanID("");
        setOpenSetToOngoingModel(false);
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
        description: "Error setting loan to ongoing",
        variant: "destructive",
      });
    } finally {
      setOpenSetToOngoingModel(false);
      setInterestRate(0);
      setInstallmentTime(0);
      setNoOfInstallments(0);
      setLoanStartingDate(new Date());
      setLoading(false);
    }
  };

  // function for delete loan
  const deleteLoan = async () => {
    try {
      setLoading(true);
      const response = await delete_loan({
        loanID: selectedLoanID,
      });
      if (response.success) {
        setAlert({
          open: true,
          message: "Success",
          description: "Loan deleted successfully",
          variant: "default",
        });
        fetchTableData(pageNo, pageSize, searchValue);
        setSelectedLoanID("");
        setOpenDeleteModel(false);
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
      setOpenPendingModel(false);
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
      <Breadcrumb pageName="Approved Loans" />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
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
              {/* <TableHead>Status</TableHead> */}
              <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tableData.map((item, index) => (
              <TableRow
                key={index}
                className="border-[#eee] dark:border-dark-3"
              >
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">{item.ID}</p>
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

                <TableCell className="xl:pr-7.5">
                  <div
                    className="flex cursor-pointer items-center justify-end gap-x-3.5"
                    onClick={() => {
                      setSelectedLoanID(item.ID);
                      setReasonForReject(
                        item.rejectedReason
                          ? item.rejectedReason
                          : "No reason provided",
                      );
                    }}
                  >
                    <DropDownMenuComponent
                      options={[
                        {
                          label: "View loan",
                          value: () => {
                            router.push(
                              `/admin/loan_details/detail_view?loanID=${item.ID}`,
                            );
                          },
                        },
                        {
                          label: "Set to ongoing loan",
                          value: () => {
                            setOpenSetToOngoingModel(true);
                          },
                        },
                        ...(item.loanStatus !== loanConstants.status.ongoing ||
                        item.loanStatus === loanConstants.status.completed
                          ? [
                              {
                                label: "Delete loan",
                                value: () => {
                                  setOpenDeleteModel(true);
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
        <div className="flex items-center justify-between border-t border-stroke py-4 dark:border-dark-3">
          <PaginationComponent
            currentPage={pageNo}
            totalPages={noOfPages}
            onPageChange={(currentPage) => {
              setPageNo(currentPage);
              fetchTableData(currentPage, pageSize, searchValue);
            }}
          />
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
        {/* set to pending */}
        <ConfirmationDialog
          isOpen={openPendingModel}
          title="Set Loan to Pending"
          description="Are you sure you want to set this loan to pending?"
          onCancel={() => setOpenPendingModel(false)}
          isSaveButton={true}
          onSubmit={() => {
            setLoanStatusToPending();
            setOpenPendingModel(false);
          }}
        />
        {/* view rejected reason */}
        <ConfirmationDialog
          isOpen={openViewRejectedReasonModel}
          title="Rejected Reason"
          description={reasonForReject || "No reason provided"}
          onCancel={() => setOpenViewRejectedReasonModel(false)}
          onSubmit={() => {
            setOpenViewRejectedReasonModel(false);
            setReasonForReject("");
          }}
        />
        {/* delete loan */}
        <ConfirmationDialog
          isOpen={openDeleteModel}
          title="Delete Loan"
          description="Are you sure you want to delete this loan?"
          onCancel={() => setOpenDeleteModel(false)}
          isSaveButton={true}
          onSubmit={() => {
            deleteLoan();
            setOpenDeleteModel(false);
          }}
        />

        {/* set to ongoing */}
        <Dialog
          open={openSetToOngoingModel}
          onOpenChange={(open) => {
            !open &&
              (setOpenSetToOngoingModel(false),
              setLoanSubmissionError(false),
              setInterestRate(0),
              setInstallmentTime(0),
              setNoOfInstallments(0),
              setLoanStartingDate(new Date()));
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set as ongoing loan</DialogTitle>
            </DialogHeader>
            <InputGroup
              label="Interest Rate (%)"
              placeholder="Enter interest rate"
              type="number"
              handleChange={(e: any) => {
                setInterestRate(e.target.value);
                setLoanSubmissionError(false);
              }}
              value={interestRate ? interestRate : ""}
              required
            />
            <InputGroup
              label="Installment Time (in days)"
              placeholder="Enter installment time in dates"
              type="number"
              handleChange={(e: any) => {
                setInstallmentTime(e.target.value);
                setLoanSubmissionError(false);
              }}
              value={installmentTime ? installmentTime : ""}
              required
            />
            <InputGroup
              label="No of Installments"
              placeholder="Enter no of installments"
              type="number"
              handleChange={(e: any) => {
                setNoOfInstallments(e.target.value);
                setLoanSubmissionError(false);
              }}
              value={noOfInstallments ? noOfInstallments : ""}
              required
            />
            <InputGroup
              label="Loan Starting Date"
              placeholder="Enter loan starting date"
              type="date"
              handleChange={(e: any) => {
                setLoanStartingDate(e.target.value);
                setLoanSubmissionError(false);
              }}
              value={loanStartingDate ? loanStartingDate.toString() : ""}
              required
            />
            {loanSubmissionError && (
              <p className="mt-2 text-sm text-red-500">
                Please fill all the required fields.
              </p>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  handleSubmit();
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AllLoans;
