import React from "react";
import { cn } from "../../lib/utils";
const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        "bg-gray-950 text-gray-750 text-xs rounded-lg border border-gray-800 px-4 py-2 min-w-[120px]",
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  );
};
export default Select;
