import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIconLarge } from "../assets/icons/icons";
import { cn } from "../lib/utils";

const ModernDatePicker = forwardRef(
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
      showIcon = true,
      ...props
    },
    ref
  ) => {
    // Convert string value to Date object if needed
    const dateValue = React.useMemo(() => {
      if (!value) return null;
      if (typeof value === "string") {
        if (!value.trim()) return null;
        const date = new Date(value);
        return !isNaN(date.getTime()) ? date : null;
      }
      if (value instanceof Date) {
        return !isNaN(value.getTime()) ? value : null;
      }
      return null;
    }, [value]);
    
    // Validate date value
    const selectedDate = dateValue;

    const handleDateChange = (date) => {
      if (onChange) {
        // Convert Date to YYYY-MM-DD format for native date input compatibility
        if (date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const formattedDate = `${year}-${month}-${day}`;
          onChange({ target: { value: formattedDate } });
        } else {
          onChange({ target: { value: "" } });
        }
      }
    };

    const CustomInput = forwardRef(({ value, onClick, placeholder }, inputRef) => (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value || ""}
          onClick={onClick}
          readOnly
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full h-10 px-3 pr-10 border rounded-lg text-sm font-normal font-inter",
            "bg-white text-black placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
        />
        {showIcon && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClick}
          >
            <CalendarIconLarge className="w-5 h-5" />
          </div>
        )}
      </div>
    ));

    CustomInput.displayName = "CustomInput";

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-gray-700 text-xs font-medium font-inter mb-1">
            {label}
          </label>
        )}
        <DatePicker
          ref={ref}
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          placeholderText={placeholder}
          customInput={<CustomInput />}
          dateFormat="MMM dd, yyyy"
          showPopperArrow={false}
          popperClassName="modern-datepicker-popper"
          calendarClassName="modern-datepicker-calendar"
          dayClassName={(date) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            return cn(
              "hover:bg-sky-50 transition-colors rounded-md",
              isToday && "bg-sky-100 font-semibold",
              isSelected && "bg-sky-500 text-white hover:bg-sky-600"
            );
          }}
          weekDayClassName={() => "text-gray-600 font-medium text-xs"}
          monthClassName={() => "text-gray-900 font-semibold"}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        <style>{`
          .modern-datepicker-popper {
            z-index: 9999 !important;
          }
          
          .modern-datepicker-calendar {
            font-family: 'Inter', sans-serif;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            padding: 1rem;
            background: white;
          }
          
          .react-datepicker__header {
            background: white;
            border-bottom: 1px solid #e5e7eb;
            padding: 0.75rem 0;
            border-radius: 0.75rem 0.75rem 0 0;
          }
          
          .react-datepicker__current-month {
            color: #111827;
            font-weight: 600;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
          }
          
          .react-datepicker__day-names {
            display: flex;
            justify-content: space-around;
            margin-bottom: 0.5rem;
          }
          
          .react-datepicker__day-name {
            color: #6b7280;
            font-weight: 500;
            font-size: 0.75rem;
            width: 2.5rem;
            line-height: 2.5rem;
            margin: 0;
          }
          
          .react-datepicker__month {
            margin: 0;
            padding: 0.5rem 0;
          }
          
          .react-datepicker__week {
            display: flex;
            justify-content: space-around;
          }
          
          .react-datepicker__day {
            width: 2.5rem;
            height: 2.5rem;
            line-height: 2.5rem;
            margin: 0.125rem;
            border-radius: 0.375rem;
            color: #111827;
            font-size: 0.875rem;
            transition: all 0.2s;
          }
          
          .react-datepicker__day--outside-month {
            color: #d1d5db;
          }
          
          .react-datepicker__day--disabled {
            color: #d1d5db;
            cursor: not-allowed;
            opacity: 0.5;
          }
          
          .react-datepicker__day--keyboard-selected {
            background-color: #0ea5e9;
            color: white;
          }
          
          .react-datepicker__navigation {
            top: 1rem;
            width: 2rem;
            height: 2rem;
            border-radius: 0.375rem;
            background: #f3f4f6;
            border: none;
            transition: all 0.2s;
          }
          
          .react-datepicker__navigation:hover {
            background: #e5e7eb;
          }
          
          .react-datepicker__navigation-icon::before {
            border-color: #6b7280;
            border-width: 2px 2px 0 0;
            width: 0.5rem;
            height: 0.5rem;
          }
          
          .react-datepicker__navigation--previous {
            left: 1rem;
          }
          
          .react-datepicker__navigation--next {
            right: 1rem;
          }
          
          .react-datepicker__today-button {
            background: #f3f4f6;
            border-top: 1px solid #e5e7eb;
            color: #111827;
            font-weight: 500;
            font-size: 0.875rem;
            padding: 0.75rem;
            border-radius: 0 0 0.75rem 0.75rem;
            cursor: pointer;
            transition: background 0.2s;
          }
          
          .react-datepicker__today-button:hover {
            background: #e5e7eb;
          }
        `}</style>
      </div>
    );
  }
);

ModernDatePicker.displayName = "ModernDatePicker";

export default ModernDatePicker;

