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
    name: "Rule 1",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia ut nobis odit nostrum temporibus quo odio optio dolor ducimus explicabo. Quod velit delectus sed repellat ea fuga quae facere veritatis?",
    status: "Active",
  },
  {
    name: "Rule 2",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia ut nobis odit nostrum temporibus quo odio optio dolor ducimus explicabo. Quod velit delectus sed repellat ea fuga quae facere veritatis?",
    status: "Active",
  },
  {
    name: "Rule 3",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia ut nobis odit nostrum temporibus quo odio optio dolor ducimus explicabo. Quod velit delectus sed repellat ea fuga quae facere veritatis?",
    status: "Deactivated",
  },
];

const GroupRules = () => {
  return (
    <>
      <Breadcrumb pageName="User Group Rules" />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="min-w-[155px] xl:pl-7.5">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
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
                    {item.name}
                  </p>
                </TableCell>
                <TableCell className="min-w-[155px] xl:pl-7.5">
                  <p className="mt-[3px] text-body-sm font-medium">
                    {item.description}
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
                      },
                    )}
                  >
                    {item.status}
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

export default GroupRules;
