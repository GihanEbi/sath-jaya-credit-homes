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
    ID: "CUG00001",
    leaderName: "Don Maniwelge Gihan Piumal alwis",
    members: [
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
    ],
    status: "Active",
  },
  {
    ID: "CUG00002",
    leaderName: "Don Maniwelge Gihan Piumal alwis",
    members: [
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
    ],
    status: "Deactivated",
  },
  {
    ID: "CUG00003",
    leaderName: "Don Maniwelge Gihan Piumal alwis",
    members: [
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
    ],
    status: "Active",
  },
  {
    ID: "CUG00004",
    leaderName: "Don Maniwelge Gihan Piumal alwis",
    members: [
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
      "Don Maniwelge Gihan Piumal alwis",
    ],
    status: "Active",
  },
];
const AllUserGroups = () => {
  const router = useRouter();
  return (
    <>
      <Breadcrumb pageName="All User Groups" />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          <button
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
            onClick={() => {
              router.push("all_user_groups/add_user_group");
            }}
          >
            Add
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead>ID</TableHead>
              <TableHead>Leader Name</TableHead>
              <TableHead>Members</TableHead>
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
                <TableCell>
                  <p
                    className="cursor-pointer mt-[3px] text-body-sm font-medium"
                    onClick={() => {
                      router.push("/credit_users/all_users/profile");
                    }}
                  >
                    {item.leaderName}
                  </p>
                </TableCell>
                <TableCell>
                  {item.members.map((member, index) => (
                    <p
                      key={index}
                      className="cursor-pointer mt-[3px] text-body-sm font-medium"
                       onClick={() => {
                      router.push("/credit_users/all_users/profile");
                    }}
                    >
                      {member}
                    </p>
                  ))}
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

export default AllUserGroups;
