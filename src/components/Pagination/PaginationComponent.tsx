"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

type PaginationComponentProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) {
  // Function to render the page numbers
  // This function creates an array of PaginationItem components for each page number
  const renderPages = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={
              currentPage === 1
                ? undefined
                : () => onPageChange(currentPage - 1)
            }
            className={`cursor-pointer${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
          />
        </PaginationItem>

        {renderPages()}

        <PaginationItem>
          <PaginationNext
            onClick={
              currentPage === totalPages
                ? undefined
                : () => onPageChange(currentPage + 1)
            }
            className={`cursor-pointer${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
