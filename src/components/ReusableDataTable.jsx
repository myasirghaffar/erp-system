import React from "react";
import DataTable from "react-data-table-component";

const ReusableDataTable = ({
  loading = false,
  columns = [],
  data = [],
  customCellRenderers = {},
  customStyles = {},
  onRowClicked,
}) => {
  // Format columns for react-data-table-component
  const formatColumns = columns.map((column) => {
    const col = { ...column };

    // Set selector for data access
    col.selector = (row) => row[column.key];
    col.name = column.label;

    // Apply custom column styles if provided
    if (column.style) {
      col.style = column.style;
    }

    // Use custom cell renderer if provided, otherwise use default
    if (customCellRenderers[column.key]) {
      col.cell = (row) => customCellRenderers[column.key](row, column);
    } else if (column.render) {
      // Use render function from column definition
      col.cell = (row) => column.render(row);
    } else {
      col.cell = (row) => (
        <span
          className="text-xs"
          style={{
            color: "#4B5563",
            fontWeight: "600",
            fontFamily: "Inter",
          }}
        >
          {row[column.key]}
        </span>
      );
    }

    return col;
  });

  // Default styles for DataTable (matching provided screenshot)
  const defaultStyles = {
    table: {
      style: {
        borderSpacing: "0",
        width: "100%",
        borderCollapse: "separate",
      },
    },
    tableWrapper: {
      style: {
        borderRadius: "0",
        border: "none",
        boxShadow: "none",
        backgroundColor: "#ffffff",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f9fafb",
        minHeight: "3rem", // 48px
        borderBottom: "0.0625rem solid #f3f4f6", // 1px
        borderTop: "0.0625rem solid #f3f4f6", // 1px
        fontFamily: '"Inter", sans-serif',
      },
    },
    headCells: {
      style: {
        padding: "0 1rem", // 16px
        fontWeight: "600",
        color: "#374151", // Gray-700 (Darker)
        fontSize: "0.75rem", // 12px
        fontFamily: '"Inter", sans-serif',
        borderBottom: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textAlign: "left",
        textTransform: "none",
        alignItems: "center",
        justifyContent: "center",
        "&:first-of-type": {
          justifyContent: "flex-start",
        },
      },
    },
    rows: {
      style: {
        fontSize: "0.8125rem", // 13px
        fontWeight: "400",
        minHeight: "4.5rem", // 72px
        backgroundColor: "#ffffff",
        color: "#111827", // Gray-900
        transition: "all 0.2s ease",
        borderBottom: "0.0625rem solid #f3f4f6 !important", // 1px
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
        "&:last-child": {
          borderBottom: "none !important",
        },
      },
    },
    cells: {
      style: {
        padding: "0 1rem", // 16px
        fontSize: "0.8125rem", // 13px
        fontWeight: "500",
        fontFamily: '"Inter", sans-serif',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        alignItems: "center",
        justifyContent: "center",
        "&:first-of-type": {
          justifyContent: "flex-start",
        },
        "&:nth-of-type(2)": {
          justifyContent: "flex-start",
        },
      },
    },
  };

  // Merge custom styles with default styles
  const mergedStyles = {
    ...defaultStyles,
    ...customStyles,
    headRow: {
      ...defaultStyles.headRow,
      ...customStyles.headRow,
      style: {
        ...defaultStyles.headRow.style,
        ...(customStyles.headRow?.style || {}),
      },
    },
    headCells: {
      ...defaultStyles.headCells,
      ...customStyles.headCells,
      style: {
        ...defaultStyles.headCells.style,
        ...(customStyles.headCells?.style || {}),
      },
    },
    rows: {
      ...defaultStyles.rows,
      ...customStyles.rows,
      style: {
        ...defaultStyles.rows.style,
        ...(customStyles.rows?.style || {}),
      },
    },
    cells: {
      ...defaultStyles.cells,
      ...customStyles.cells,
      style: {
        ...defaultStyles.cells.style,
        ...(customStyles.cells?.style || {}),
      },
    },
  };

  // Default conditional row styles
  const defaultConditionalRowStyles = [
    {
      when: (row, index) => true, // Apply to all rows
      style: {
        color: "#4B5563",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #D1D1D1",
      },
    },
  ];

  return (
    <div className="overflow-x-auto bg-white">
      <style>
        {`
          .rdt_TableRow {
            border-bottom: 1px solid #D1D1D1 !important;
          }
          .rdt_TableRow:last-child {
            border-bottom: none !important;
          }
        `}
      </style>
      <DataTable
        columns={formatColumns} // Format columns for react-data-table-component
        data={data}
        customStyles={mergedStyles} // Merge custom styles with default styles
        conditionalRowStyles={defaultConditionalRowStyles}
        onRowClicked={onRowClicked}
        highlightOnHover
        noHeader
        loading={loading}
        pagination={false}
        responsive
        striped
      />
    </div>
  );
};

export default ReusableDataTable;
