import React, { useEffect, useRef, forwardRef } from "react";
import { Datepicker } from "flowbite";
import { cn } from "../lib/utils";

const FlowbiteDatePicker = forwardRef(
  (
    {
      label,
      value,
      onChange,
      placeholder = "Select date",
      minDate,
      maxDate,
      className = "",
      containerClasses = "",
      error,
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef(null);
    const datepickerRef = useRef(null);

    // Convert YYYY-MM-DD to Date object
    const parseDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    };

    // Convert Date to YYYY-MM-DD
    const formatDate = (date) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    useEffect(() => {
      if (!inputRef.current) return;

      // Destroy existing datepicker if it exists
      if (datepickerRef.current) {
        datepickerRef.current.destroy();
        datepickerRef.current = null;
      }

      // Initialize Flowbite datepicker
      const options = {
        autohide: true,
        format: "mm/dd/yyyy",
        orientation: "bottom",
        ...(minDate && { minDate: parseDate(minDate) }),
        ...(maxDate && { maxDate: parseDate(maxDate) }),
      };

      datepickerRef.current = new Datepicker(inputRef.current, options);

      // Listen for date change events
      const handleDateChange = (e) => {
        const selectedDate = e.detail.date;
        if (selectedDate && onChange) {
          const formattedDate = formatDate(selectedDate);
          onChange({ target: { value: formattedDate } });
        } else if (!selectedDate && onChange) {
          onChange({ target: { value: "" } });
        }
      };

      inputRef.current.addEventListener("changeDate", handleDateChange);

      // Set initial value if provided
      if (value) {
        const dateValue = parseDate(value);
        if (dateValue && datepickerRef.current) {
          datepickerRef.current.setDate(dateValue);
        }
      }

      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener("changeDate", handleDateChange);
        }
        if (datepickerRef.current) {
          datepickerRef.current.destroy();
        }
      };
    }, [minDate, maxDate]); // Recreate datepicker when min/max dates change

    // Update datepicker when value changes externally
    useEffect(() => {
      if (datepickerRef.current && inputRef.current) {
        if (value) {
          const dateValue = parseDate(value);
          if (dateValue) {
            datepickerRef.current.setDate(dateValue);
          }
        } else {
          // Clear the input value directly - Flowbite datepicker doesn't have a clear() method
          if (inputRef.current) {
            inputRef.current.value = "";
            // Trigger input event to sync with datepicker
            inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      }
    }, [value]);

    // Note: min/max dates are handled in the initialization useEffect above
    // by including them in the dependency array, which recreates the datepicker

    const inputId = id || `flowbite-datepicker-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-gray-700 text-xs font-medium font-inter mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            datepicker
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "block w-full ps-9 pe-3 py-2.5 bg-white border text-gray-900 text-sm rounded-lg",
              "focus:ring-2 focus:ring-sky-500 focus:border-sky-500",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
              "shadow-sm placeholder:text-gray-400",
              error ? "border-red-500" : "border-gray-300",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        <style>{`
          /* Flowbite Datepicker Dropdown Background */
          .datepicker-dropdown {
            background-color: white !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 0.5rem !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            padding: 0.75rem !important;
          }
          
          .datepicker-picker {
            background-color: white !important;
          }
          
          .datepicker-view {
            background-color: white !important;
          }
          
          .datepicker-grid {
            background-color: white !important;
          }
          
          .datepicker-cell {
            background-color: white !important;
          }
          
          .datepicker-cell:hover {
            background-color: #f3f4f6 !important;
          }
          
          .datepicker-cell.selected {
            background-color: #0ea5e9 !important;
            color: white !important;
          }
          
          .datepicker-cell.today {
            background-color: #e0f2fe !important;
            color: #0ea5e9 !important;
            font-weight: 600 !important;
          }
          
          .datepicker-header {
            background-color: white !important;
            border-bottom: 1px solid #e5e7eb !important;
          }
        `}</style>
      </div>
    );
  }
);

FlowbiteDatePicker.displayName = "FlowbiteDatePicker";

export default FlowbiteDatePicker;

