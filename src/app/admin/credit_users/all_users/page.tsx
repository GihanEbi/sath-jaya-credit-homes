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

// -------------services-----------------
import { cn } from "@/lib/utils";
import { PaginationComponent } from "@/components/Pagination/PaginationComponent";
import { Loader } from "@/components/Loader/Loader";
import React, { useEffect } from "react";
import {
  change_status,
  get_credit_users,
} from "@/routes/credit-user/creditUserRoute";
import { AlertDialogDemo } from "@/components/AlertDialog/AlertDialog";
import DropDownMenuComponent from "@/components/DropDownMenuComponent/DropDownMenuComponent";

// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

type userObj = {
  ID: string;
  creditUserID: string;
  fullName: string;
  gender: string;
  birthday: string;
  permanentAddress: string;
  phoneNo: string;
  address: string;
  nic: string;
  maritalStatus: string;
  email: string;
  profilePicture: string;
  nicFrontPicture: string;
  nicBackPicture: string;
  locationCertificationPicture: string;
  isActive: boolean;
};

const AllUsers = () => {
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
  const [tableData, setTableData] = React.useState<userObj[]>([]);

  // --------- first render to get users data ---------
  useEffect(() => {
    fetchUsers(pageNo, pageSize, searchValue);
  }, []);

  // --------- function to get users data ---------
  const fetchUsers = async (
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

      const data = await get_credit_users(params, searchValue);
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

  // --------- function to change the user status ---------
  const changeUserStatus = async (userID: string, isActive: boolean) => {
    // prevent multiple clicks
    if (loading) return;
    try {
      setLoading(true);
      let dataObj = {
        creditUserID: userID,
        newStatus: isActive,
      };
      const data = await change_status(dataObj);

      if (data.success) {
        // setAlert({
        //   open: true,
        //   message: "Success",
        //   description: data.message,
        //   variant: "default",
        // });
        fetchUsers(pageNo, pageSize, searchValue);
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
        description: "Error changing user status",
        variant: "destructive",
      });
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
      <Breadcrumb pageName="All Users" />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          <button
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
            onClick={() => {
              router.push("all_users/add_user");
            }}
          >
            Add
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead>ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>NIC</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead>Phone No</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
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
                <TableCell
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`all_users/profile?userID=${item.ID}`);
                  }}
                >
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.fullName}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.nic}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.birthday}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.phoneNo}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.address}
                  </p>
                </TableCell>

                <TableCell>
                  <div
                    className={cn(
                      "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                      {
                        "bg-[#219653]/[0.08] text-[#219653]": item.isActive,
                        "bg-[#D34053]/[0.08] text-[#D34053]": !item.isActive,
                        //   "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                        //     item.status === "Pending",
                      },
                    )}
                  >
                    {item.isActive ? "Active" : "Deactivated"}
                  </div>
                </TableCell>

                <TableCell className="xl:pr-7.5">
                  <div className="flex cursor-pointer items-center justify-end gap-x-3.5">
                    <DropDownMenuComponent
                      options={[
                        {
                          label: "Edit",
                          value: () => {
                            router.push(`all_users/add_user?userID=${item.ID}`);
                          },
                        },
                        {
                          label: "View",
                          value: () => {
                            router.push(`all_users/profile?userID=${item.ID}`);
                          },
                        },
                        {
                          label: `${item.isActive ? "Deactivate" : "Activate"}`,
                          value: () => {
                            changeUserStatus(item.ID, !item.isActive);
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
              fetchUsers(currentPage, pageSize, searchValue);
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
      </div>
    </>
  );
};

export default AllUsers;
