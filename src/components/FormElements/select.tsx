"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";

type PropsType = {
  label: string;
  items: { value: string | boolean; label: string }[];
  prefixIcon?: React.ReactNode;
  className?: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string | boolean;
  error?: string;
  required?: boolean;
} & (
  | { placeholder?: string; defaultValue: string | boolean }
  | { placeholder: string; defaultValue?: string | boolean }
);

export function Select({
  items,
  label,
  defaultValue,
  placeholder,
  prefixIcon,
  className,
  handleChange,
  error,
  required,
  value,
}: PropsType) {
  const id = useId();

  const [isOptionSelected, setIsOptionSelected] = useState(false);

  return (
    <div className={cn("space-y-3", className)}>
      <label
        htmlFor={id}
        className="block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
        {required && <span className="ml-1 select-none text-red">*</span>}
      </label>

      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {prefixIcon}
          </div>
        )}

        <select
          id={id}
          defaultValue={
            defaultValue === true
              ? "Yes"
              : defaultValue === false
                ? "No"
                : defaultValue || ""
          }
          onChange={(e) => {
            setIsOptionSelected(true);
            handleChange(e);
          }}
          value={value === true ? "Yes" : value === false ? "No" : value || ""}
          className={cn(
            "w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary [&>option]:text-dark-5 dark:[&>option]:text-dark-6",
            isOptionSelected && "text-dark dark:text-white",
            prefixIcon && "pl-11.5",
          )}
          required={required}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {items.map((item, index) => (
            <option
              key={index}
              value={
                item.value === true
                  ? "Yes"
                  : item.value === false
                    ? "No"
                    : item.value
              }
            >
              {item.label}
            </option>
          ))}
        </select>

        <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />
      </div>
      <div className="mt-1">
        {error && <h2 className="text-sm text-red">{error}</h2>}
      </div>
    </div>
  );
}
