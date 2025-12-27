import React, { useState, useCallback } from "react";
import ReusableDataTable from "../../../../components/ReusableDataTable";
import ReusableFilter from "../../../../components/ReusableFilter";
import ReusablePagination from "../../../../components/ReusablePagination";
import { Building2, Search } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AttendanceReport = () => {
    const { t } = useTranslation();
    const itemsPerPage = 10;

    // Demo Data exactly matching the screenshot
    const demoData = React.useMemo(() => [
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
    ], []);

    const filterConfig = React.useMemo(() => [
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
    ], [t]);

    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(demoData);

    const handleFilteredDataChange = useCallback((newData) => {
        setFilteredData(newData);
        setCurrentPage(1);
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTableData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const columns = React.useMemo(() => [
        {
            key: "selection",
            label: "",
            width: "3.75rem", // 60px
            render: () => (
                <div className="flex justify-center w-full">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer" />
                </div>
            )
        },
        {
            key: "name",
            label: t('table.name'), // Localized
            minWidth: "12.5rem", // 200px
            grow: 1, // Allow this column to grow to fill empty space
            render: (row) => (
                <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 overflow-hidden">
                        {/* Avatar Placeholder */}
                    </div>
                    <span className="text-[#374151] font-bold text-[0.8125rem] whitespace-nowrap">{row.name}</span>
                </div>
            )
        },
        {
            key: "checkIn",
            label: t('attendance.checkIn'), // Localized
            minWidth: "11.25rem", // 180px
            render: (row) => (
                <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className={`w-4 h-4 shrink-0 -translate-y-1 ${row.checkIn.color}`} fill="currentColor" />
                    <div className="flex flex-col">
                        <span className="text-[#111827] font-semibold text-[0.75rem]">{row.checkIn.time}</span>
                        <span className="text-gray-400 text-[0.625rem] font-medium">{row.checkIn.date}</span>
                    </div>
                </div>
            )
        },
        {
            key: "workplace",
            label: t('workplace.workplaceName'), // Localized
            minWidth: "10rem", // 160px
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-500 font-medium text-[0.8125rem]">{row.workplace}</span>
                </div>
            )
        },
        {
            key: "checkOut",
            label: t('attendance.checkOut'), // Localized
            minWidth: "11.25rem", // 180px
            render: (row) => (
                <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className={`w-4 h-4 shrink-0 -translate-y-1 ${row.checkOut.color}`} fill="currentColor" />
                    <div className="flex flex-col">
                        <span className="text-[#111827] font-semibold text-[0.75rem]">{row.checkOut.time}</span>
                        <span className="text-gray-400 text-[0.625rem] font-medium">{row.checkOut.date}</span>
                    </div>
                </div>
            )
        },
        {
            key: "type",
            label: t('attendance.type'), // Localized
            minWidth: "6.25rem", // 100px
            render: (row) => (
                <span className="text-[#111827] font-semibold text-[0.8125rem]">{row.type}</span>
            )
        },
        {
            key: "duration",
            label: t('attendance.duration'), // Localized
            minWidth: "6.25rem", // 100px
            render: (row) => (
                <span className="text-[#111827] font-semibold text-[0.8125rem]">{row.duration}</span>
            )
        },
        {
            key: "note",
            label: t('attendance.managerNote'), // Localized (and fixed typo "Manger")
            minWidth: "10rem", // Added minWidth to ensure it doesn't collapse
            render: (row) => (
                <span className="text-[#111827] font-semibold text-[0.8125rem]">{row.note}</span>
            )
        }
    ], [t]);

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
                        onFilteredDataChange={handleFilteredDataChange}
                        className="w-full flex-col md:flex-row items-center gap-4"
                        searchClassName="w-full md:flex-1"
                        filterClassName="flex-wrap gap-3"
                        dropdownClassName="min-w-[150px]"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full">
                <ReusableDataTable
                    columns={columns}
                    data={currentTableData}
                />

                {/* Pagination */}
                <div className="border-t border-gray-100">
                    <ReusablePagination
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;
