"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// -------------components-----------------
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
import { get_users } from "@/routes/users/userRoutes";

// -------------types-----------------
type variant = "default" | "destructive";
type Alert = {
  open: boolean;
  message: string;
  description: string;
  variant: variant;
};

// --------- user data types ---------
interface userObj {
  ID: string;
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  phoneNo: string;
  address: string;
  status: string;
}

const Users = () => {
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

      const data = await get_users(params, searchValue);
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

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-dark/50">
          <Loader />
        </div>
      )}
      <Breadcrumb pageName="Users" />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          <button
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
            onClick={() => {
              router.push("/admin/users/add_user");
            }}
          >
            Add
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead>Email</TableHead>
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
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.firstName}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.lastName}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.birthday}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.email}
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
                    <button className="hover:text-primary">
                      <span className="sr-only">Delete Invoice</span>
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

export default Users;
