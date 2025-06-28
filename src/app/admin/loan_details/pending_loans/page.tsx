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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PaginationComponent } from "@/components/Pagination/PaginationComponent";
import { Loader } from "@/components/Loader/Loader";
import React, { useEffect } from "react";
import { AlertDialogDemo } from "@/components/AlertDialog/AlertDialog";
import DropDownMenuComponent from "@/components/DropDownMenuComponent/DropDownMenuComponent";
import {
  approve_reject_loan,
  get_loans,
  get_pending_loans,
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
};
// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

const PendingLoans = () => {
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

  const [openApproveModel, setOpenApproveModel] = React.useState(false);
  const [openRejectModel, setOpenRejectModel] = React.useState(false);
  const [reasonForReject, setReasonForReject] = React.useState("");
  const [selectedLoanID, setSelectedLoanID] = React.useState<string>("");

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

      const data = await get_pending_loans(params, searchValue);
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
  const approveLoan = async () => {
    try {
      setLoading(true);
      const response = await approve_reject_loan({
        loanID: selectedLoanID,
        action: loanConstants.status.approved,
      });
      if (response.success) {
        setAlert({
          open: true,
          message: "Success",
          description: "Loan approved successfully",
          variant: "default",
        });
        fetchTableData(pageNo, pageSize, searchValue);
        setSelectedLoanID("");
        setOpenApproveModel(false);
        setOpenRejectModel(false);
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
      setOpenApproveModel(false);
      setLoading(false);
    }
  };

  // function to reject the loan
  const rejectLoan = async () => {
    try {
      setLoading(true);
      const response = await approve_reject_loan({
        loanID: selectedLoanID,
        action: loanConstants.status.rejected,
        rejectedReason: reasonForReject,
      });
      if (response.success) {
        setAlert({
          open: true,
          message: "Success",
          description: "Loan rejected successfully",
          variant: "default",
        });
        fetchTableData(pageNo, pageSize, searchValue);
        setSelectedLoanID("");
        setOpenApproveModel(false);
        setOpenRejectModel(false);
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
        description: "Error rejecting loan",
        variant: "destructive",
      });
    } finally {
      setOpenApproveModel(false);
      setOpenRejectModel(false);
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
      <Breadcrumb pageName="Pending Loans" />
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
                        {
                          label: "Approve loan",
                          value: () => {
                            setOpenApproveModel(true);
                          },
                        },
                        {
                          label: "Reject loan",
                          value: () => {
                            setOpenRejectModel(true);
                          },
                        },
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
        {/* Alert Dialog for Approve Loan */}
        <ConfirmationDialog
          isOpen={openApproveModel}
          title="Approve Loan"
          description="Are you sure you want to approve this loan?"
          onCancel={() => setOpenApproveModel(false)}
          isSaveButton={true}
          onSubmit={() => {
            approveLoan();
            setOpenApproveModel(false);
          }}
        />
        {/* Alert Dialog for Reject Loan */}
        <ConfirmationDialog
          isOpen={openRejectModel}
          title="Reject Loan"
          description="Are you sure you want to reject this loan?"
          isInput={true}
          inputLabel="Reason for rejection"
          inputPlaceholder="Enter reason for rejection"
          inputChange={(e: any) => {
            setReasonForReject(e.target.value);
          }}
          isSaveButton={true}
          inputValue={reasonForReject}
          isInputRequired={true}
          onCancel={() => setOpenRejectModel(false)}
          onSubmit={() => {
            // Handle reject loan logic here
            rejectLoan();
            setOpenRejectModel(false);
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
    </>
  );
};

export default PendingLoans;
