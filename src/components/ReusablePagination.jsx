import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReusablePagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
  showPageInfo = false,
}) => {
  const getVisiblePages = () => {
    const delta = 1; // Show one page on each side of the current page for a compact look
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    rangeWithDots.push(1);

    // Calculate range around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add dots before range if there's a gap
    if (currentPage - delta > 2) {
      rangeWithDots.push("...");
    }

    // Add the range
    rangeWithDots.push(...range);

    // Add dots after range if there's a gap
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  const safeCurrentPage = Math.max(1, currentPage);
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0 bg-white p-4 px-8 border-t border-gray-100">
      {/* Page Info */}
      <div className="text-gray-400 text-[13px] font-medium text-center md:text-left">
        Showing <span className="text-gray-900 font-bold">{((safeCurrentPage - 1) * itemsPerPage) + 1}</span> - <span className="text-gray-900 font-bold">{Math.min(safeCurrentPage * itemsPerPage, totalItems)}</span> of <span className="text-gray-900 font-bold">{totalItems}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className="p-2 text-gray-300 hover:text-sky-500 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        {/* Page Numbers */}
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-2 text-gray-300 font-bold tracking-widest text-[13px]">
                ...
              </span>
            ) : (
              <button
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-xl text-[13px] font-bold transition-all ${safeCurrentPage === page
                    ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                    : "hover:bg-gray-50 text-gray-500"
                  }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          className="p-2 text-gray-400 hover:text-sky-500 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default ReusablePagination;
