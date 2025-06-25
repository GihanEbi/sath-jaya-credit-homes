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
    ID: "CUS00001",
    fullName: "Don Maniwelge Gihan Piumal alwis",
    nic: "953092190V",
    dob: "1995-11-04",
    phone: "0776603689",
    address: "No-337, Perera Road, Alubomulla",
    status: "Active",
  },
  {
    ID: "CUS00002",
    fullName: "Don Maniwelge Gihan Piumal alwis",
    nic: "953092190V",
    dob: "1995-11-04",
    phone: "0776603689",
    address: "No-337, Perera Road, Alubomulla",
    status: "Active",
  },
  {
    ID: "CUS00003",
    fullName: "Don Maniwelge Gihan Piumal alwis",
    nic: "953092190V",
    dob: "1995-11-04",
    phone: "0776603689",
    address: "No-337, Perera Road, Alubomulla",
    status: "Active",
  },
  {
    ID: "CUS00004",
    fullName: "Don Maniwelge Gihan Piumal alwis",
    nic: "953092190V",
    dob: "1995-11-04",
    phone: "0776603689",
    address: "No-337, Perera Road, Alubomulla",
    status: "Active",
  },
];

const AllUsers = () => {
  const router = useRouter();
  return (
    <>
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
            {tempData.map((item, index) => (
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
                    router.push("all_users/profile");
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
                    {item.dob}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.phone}
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
                      <span className="sr-only">View Profile</span>
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

export default AllUsers;
