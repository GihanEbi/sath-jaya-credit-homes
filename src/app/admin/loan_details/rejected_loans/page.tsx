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
import { PaginationComponent } from "@/components/Pagination/PaginationComponent";
import { Loader } from "@/components/Loader/Loader";
import React, { useEffect } from "react";
import { AlertDialogDemo } from "@/components/AlertDialog/AlertDialog";
import DropDownMenuComponent from "@/components/DropDownMenuComponent/DropDownMenuComponent";
import {
  delete_loan,
  get_loans,
  get_rejected_loans,
  set_reject_to_pending,
} from "@/routes/loan/loanRoutes";
import { loanConstants } from "@/constants/loan_constants";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";

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

      const data = await get_rejected_loans(params, searchValue);
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
      <Breadcrumb pageName="Rejected Loans" />
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
                {/* <TableCell>
                  <div
                    className={cn(
                      "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                      {
                        "bg-[#219653]/[0.08] text-[#dfe231]":
                          item.loanStatus === loanConstants.status.pending,
                        "bg-[#219653]/[0.08] text-[#219653]":
                          item.loanStatus === loanConstants.status.approved,
                        "bg-[#219653]/[0.08] text-[#180ea5]":
                          item.loanStatus === loanConstants.status.ongoing,
                        "bg-[#D34053]/[0.08] text-[#D34053]":
                          item.loanStatus === loanConstants.status.rejected,
                        "bg-[#D34053]/[0.08] text-[#ba36ee]":
                          item.loanStatus === loanConstants.status.completed,
                      },
                    )}
                  >
                    {item.loanStatus}
                  </div>
                </TableCell> */}

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
                          label: "Edit",
                          value: () => {
                            router.push(
                              `/admin/loan_details/new_loan?loanID=${item.ID}`,
                            );
                          },
                        },
                        {
                          label: "View loan",
                          value: () => {
                            router.push(
                              `/admin/loan_details/detail_view?loanID=${item.ID}`,
                            );
                          },
                        },
                        ...(item.loanStatus === loanConstants.status.rejected
                          ? [
                              {
                                label: "Set to pending",
                                value: () => {
                                  setOpenPendingModel(true);
                                },
                              },
                            ]
                          : []),
                        ...(item.loanStatus === loanConstants.status.rejected
                          ? [
                              {
                                label: "View Rejected Reason",
                                value: () => {
                                  setOpenViewRejectedReasonModel(true);
                                },
                              },
                            ]
                          : []),
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
      </div>
    </>
  );
};

export default AllLoans;
