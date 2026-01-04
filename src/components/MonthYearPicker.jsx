import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "../lib/utils";

const MonthYearPicker = ({
  value,
  onChange,
  placeholder = "Select month and year",
  className = "",
  label,
  minYear = 2024,
  maxYear = 2035,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => {
    if (value) {
      const [year] = value.split("-");
      return parseInt(year) || new Date().getFullYear();
    }
    return new Date().getFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (value) {
      const [, month] = value.split("-");
      return parseInt(month) - 1 || new Date().getMonth();
    }
    return new Date().getMonth();
  });

  const pickerRef = useRef(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      const [year, month] = value.split("-");
      if (year && month) {
        setSelectedYear(parseInt(year));
        setSelectedMonth(parseInt(month) - 1);
      }
    }
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMonthSelect = (monthIndex) => {
    setSelectedMonth(monthIndex);
    const monthStr = String(monthIndex + 1).padStart(2, "0");
    const newValue = `${selectedYear}-${monthStr}`;
    onChange({ target: { value: newValue } });
    setIsOpen(false);
  };

  const handleYearChange = (newYear) => {
    if (newYear >= minYear && newYear <= maxYear) {
      setSelectedYear(newYear);
      const monthStr = String(selectedMonth + 1).padStart(2, "0");
      const newValue = `${newYear}-${monthStr}`;
      onChange({ target: { value: newValue } });
    }
  };

  const getDisplayText = () => {
    if (value) {
      const [year, month] = value.split("-");
      if (year && month) {
        const monthIndex = parseInt(month) - 1;
        return `${months[monthIndex]} ${year}`;
      }
    }
    return placeholder;
  };

  return (
    <div className={cn("relative", className)} ref={pickerRef}>
      {label && (
        <label className="block text-gray-700 text-xs font-medium font-inter mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full h-11 bg-white text-black text-sm font-normal font-inter",
          "border border-gray-300 rounded-lg px-4 py-2",
          "flex items-center justify-between",
          "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500",
          "transition-colors",
          disabled && "opacity-50 cursor-not-allowed",
          !value && "text-gray-400"
        )}
      >
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="truncate">{getDisplayText()}</span>
        </span>
        <ChevronRight
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            isOpen && "transform rotate-90"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-80 max-w-[calc(100vw-2rem)] transform transition-all duration-200 ease-out origin-top-left opacity-100 scale-100">
          <div className="p-4">
            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {months.map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthSelect(index)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap",
                    index === selectedMonth && selectedYear >= minYear && selectedYear <= maxYear
                      ? "bg-sky-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
                  )}
                >
                  {month}
                </button>
              ))}
            </div>

            {/* Year Selection */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleYearChange(selectedYear - 1)}
                  disabled={selectedYear <= minYear}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    selectedYear <= minYear
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:text-sky-500 hover:bg-sky-50"
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="px-4 py-2 bg-gray-50 rounded-lg min-w-[80px] text-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {selectedYear}
                  </span>
                </div>
                <button
                  onClick={() => handleYearChange(selectedYear + 1)}
                  disabled={selectedYear >= maxYear}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    selectedYear >= maxYear
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:text-sky-500 hover:bg-sky-50"
                  )}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;

