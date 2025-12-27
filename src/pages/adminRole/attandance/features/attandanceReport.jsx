import React, { useState } from "react";
import ReusableDataTable from "../../../../components/ReusableDataTable";
import ReusableFilter from "../../../../components/ReusableFilter";
import { Building2, Search } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";


const AttendanceReport = () => {
    const { t } = useTranslation();

    // Demo Data exactly matching the screenshot
    const demoData = [
        {
            id: 1,
            name: "Michael Chen",
            checkIn: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-green-500" },
            workplace: "Headquarters",
            checkOut: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-green-500" },
            type: "QR Scan",
            duration: "2h 15m",
            note: "On Time",
        },
        // ... (keeping other data same for brevity, can translate values if needed)
        {
            id: 2,
            name: "Michael Chen",
            checkIn: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-red-500" },
            workplace: "Headquarters",
            checkOut: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-green-500" },
            type: "QR Scan",
            duration: "2h 15m",
            note: "Half day leave",
        },
        {
            id: 3,
            name: "Michael Chen",
            checkIn: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-gray-400" },
            workplace: "Headquarters",
            checkOut: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-green-500" },
            type: "QR Scan",
            duration: "2h 15m",
            note: "Overtime approved",
        },
        {
            id: 4,
            name: "Michael Chen",
            checkIn: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-green-500" },
            workplace: "Headquarters",
            checkOut: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-red-500" },
            type: "QR Scan",
            duration: "2h 15m",
            note: "On Time",
        },
        {
            id: 5,
            name: "Michael Chen",
            checkIn: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-red-500" },
            workplace: "Headquarters",
            checkOut: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-green-500" },
            type: "QR Scan",
            duration: "2h 15m",
            note: "On Time",
        },
        {
            id: 6,
            name: "Michael Chen",
            checkIn: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-green-500" },
            workplace: "Headquarters",
            checkOut: { time: "08:45 AM", date: "Dec 24, 2024", color: "text-green-500" },
            type: "QR Scan",
            duration: "2h 15m",
            note: "On Time",
        }
    ];

    const [filteredData, setFilteredData] = useState(demoData);

    const columns = [
        {
            key: "selection",
            label: "",
            width: "60px",
            render: () => (
                <div className="flex justify-center w-full">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer" />
                </div>
            )
        },
        {
            key: "name",
            label: t('table.name'),
            width: "200px",
            render: (row) => (
                <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 overflow-hidden">
                        {/* Avatar Placeholder */}
                    </div>
                    <span className="text-[#374151] font-bold text-[13px] whitespace-nowrap">{row.name}</span>
                </div>
            )
        },
        {
            key: "checkIn",
            label: t('attendance.checkIn'),
            width: "180px",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className={`w-4 h-4 shrink-0 -translate-y-1 ${row.checkIn.color}`} fill="currentColor" />
                    <div className="flex flex-col">
                        <span className="text-[#111827] font-semibold text-[12px]">{row.checkIn.time}</span>
                        <span className="text-gray-400 text-[10px] font-medium">{row.checkIn.date}</span>
                    </div>
                </div>
            )
        },
        {
            key: "workplace",
            label: t('workplace.workplaceName'),
            width: "160px",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-500 font-medium text-[13px]">{row.workplace}</span>
                </div>
            )
        },
        {
            key: "checkOut",
            label: t('attendance.checkOut'),
            width: "180px",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className={`w-4 h-4 shrink-0 -translate-y-1 ${row.checkOut.color}`} fill="currentColor" />
                    <div className="flex flex-col">
                        <span className="text-[#111827] font-semibold text-[12px]">{row.checkOut.time}</span>
                        <span className="text-gray-400 text-[10px] font-medium">{row.checkOut.date}</span>
                    </div>
                </div>
            )
        },
        {
            key: "type",
            label: t('attendance.type'),
            width: "100px",
            render: (row) => (
                <span className="text-[#111827] font-semibold text-[13px]">{row.type}</span>
            )
        },
        {
            key: "duration",
            label: t('attendance.duration'),
            width: "100px",
            render: (row) => (
                <span className="text-[#111827] font-semibold text-[13px]">{row.duration}</span>
            )
        },
        {
            key: "note",
            label: t('attendance.managerNote'),
            render: (row) => (
                <span className="text-[#111827] font-semibold text-[13px]">{row.note}</span>
            )
        }
    ];

    const filterConfig = [
        {
            key: "workplace",
            label: t('attendance.allWorkplaces'),
            options: [
                { label: t('attendance.allWorkplaces'), value: "" },
                { label: "Headquarters", value: "Headquarters" }
            ]
        },
        {
            key: "type",
            label: t('attendance.type'),
            options: [
                { label: t('attendance.type'), value: "" },
                { label: "QR Scan", value: "QR Scan" }
            ]
        },
        {
            key: "dateRange",
            label: "Today",
            options: [
                { label: "Today", value: "today" },
                { label: "Yesterday", value: "yesterday" }
            ]
        }
    ];

    const customTableStyles = {
        tableWrapper: {
            style: {
                borderRadius: "0",
                border: "none",
                boxShadow: "none",
            },
        },
        headRow: {
            style: {
                backgroundColor: "#f9fafb",
                minHeight: "52px",
                borderBottom: "1px solid #f3f4f6",
                borderTop: "1px solid #f3f4f6",
            },
        },
        headCells: {
            style: {
                color: "#6b7280",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "none",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        rows: {
            style: {
                minHeight: "76px",
                borderBottom: "1px solid #f3f4f6 !important",
                "&:hover": {
                    backgroundColor: "#f9fafb",
                },
            },
        },
        cells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
            }
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            {/* Header Section */}
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <h2 className="text-[#111827] text-xl font-bold font-inter">{t('attendance.employeeAttendance')}</h2>
                    <div className="flex flex-col items-end">
                        <span className="text-[#111827] text-2xl font-bold font-inter tracking-tight">29h 45m</span>
                        <span className="text-gray-400 text-[10px] font-medium font-inter">{t('attendance.totalWorkedHours')}</span>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="w-full">
                    <ReusableFilter
                        searchConfig={{ placeholder: t('employee.searchEmployee') }}
                        filters={filterConfig}
                        data={demoData}
                        onFilteredDataChange={setFilteredData}
                        className="w-full flex-col md:flex-row items-center gap-4"
                        searchClassName="w-full md:flex-1"
                        filterClassName="flex-wrap gap-3"
                        dropdownClassName="min-w-[150px]"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full">
                <style>
                    {`
                        .rdt_TableHeadRow {
                            background-color: #f9fafb !important;
                        }
                        .rdt_TableRow {
                            border-bottom: 1px solid #f3f4f6 !important;
                        }
                    `}
                </style>
                <ReusableDataTable
                    columns={columns}
                    data={filteredData}
                    customStyles={customTableStyles}
                />
            </div>
        </div>
    );
};

export default AttendanceReport;
