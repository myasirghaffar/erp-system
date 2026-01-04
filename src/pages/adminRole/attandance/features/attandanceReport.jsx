import React, { useState, useCallback, useMemo } from "react";
import ReusableDataTable from "../../../../components/ReusableDataTable";
import ReusableFilter from "../../../../components/ReusableFilter";
import ReusablePagination from "../../../../components/ReusablePagination";
import FlowbiteDatePicker from "../../../../components/FlowbiteDatePicker";
import { Building2, Search, Check, X, Clock } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useGetAdminAttendanceHistoryQuery, useGetAllWorkplacesQuery, useGetMonthlyMetricsQuery, useUpdateAttendanceRecordStatusMutation } from "../../../../services/Api";
import { toast } from "react-toastify";
import moment from "moment";

// Beautiful color palette for avatars
const avatarColors = [
    { bg: "bg-blue-500", text: "text-white" },
    { bg: "bg-purple-500", text: "text-white" },
    { bg: "bg-pink-500", text: "text-white" },
    { bg: "bg-indigo-500", text: "text-white" },
    { bg: "bg-teal-500", text: "text-white" },
    { bg: "bg-cyan-500", text: "text-white" },
    { bg: "bg-emerald-500", text: "text-white" },
    { bg: "bg-rose-500", text: "text-white" },
    { bg: "bg-amber-500", text: "text-white" },
    { bg: "bg-orange-500", text: "text-white" },
    { bg: "bg-violet-500", text: "text-white" },
    { bg: "bg-fuchsia-500", text: "text-white" },
    { bg: "bg-lime-500", text: "text-white" },
    { bg: "bg-sky-500", text: "text-white" },
    { bg: "bg-red-500", text: "text-white" },
];

// Generate consistent color based on name
const getAvatarColor = (name) => {
    if (!name) return avatarColors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatarColors.length;
    return avatarColors[index];
};

const AttendanceReport = () => {
    const { t } = useTranslation();
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        workplace: "",
        type: "",
        start_date: "",
        end_date: "",
    });

    // Modal states
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    // Mutation for updating attendance record status
    const [updateAttendanceRecordStatus, { isLoading: isUpdating }] = useUpdateAttendanceRecordStatusMutation();

    // Use date filters directly - ensure undefined for empty strings to trigger query changes
    const dateRange = useMemo(() => {
        return {
            start_date: filters.start_date && filters.start_date.trim() !== "" ? filters.start_date : undefined,
            end_date: filters.end_date && filters.end_date.trim() !== "" ? filters.end_date : undefined,
        };
    }, [filters.start_date, filters.end_date]);

    // Get current month and year for monthly metrics
    const currentMonth = moment().month() + 1; // moment months are 0-indexed
    const currentYear = moment().year();

    // Fetch monthly metrics
    const { data: monthlyMetricsData } = useGetMonthlyMetricsQuery({
        month: currentMonth,
        year: currentYear,
    });

    // Get unique workplaces from API data for filter options
    const { data: workplacesData } = useGetAllWorkplacesQuery({ limit: 100 });

    // Get workplace name from ID for API filter
    const selectedWorkplaceName = useMemo(() => {
        if (!filters.workplace || !workplacesData?.data?.workplaces) return undefined;
        const workplace = workplacesData.data.workplaces.find(wp => wp.id.toString() === filters.workplace);
        return workplace?.name;
    }, [filters.workplace, workplacesData]);

    // Prepare query parameters - ensure consistent undefined for empty values to trigger refetch
    // Using explicit parameters instead of object to ensure React Query detects changes
    const queryParams = useMemo(() => {
        const params = {
            page: currentPage,
            limit: itemsPerPage,
        };
        
        if (dateRange.start_date) params.start_date = dateRange.start_date;
        if (dateRange.end_date) params.end_date = dateRange.end_date;
        if (searchTerm && searchTerm.trim() !== "") params.employee_name = searchTerm.trim();
        if (selectedWorkplaceName) params.workplace_name = selectedWorkplaceName;
        if (filters.type === "manual") params.is_manual = "true";
        else if (filters.type === "qr_scan") params.is_manual = "false";
        
        // Return a new object reference every time to ensure React Query detects changes
        return { ...params };
    }, [currentPage, itemsPerPage, dateRange.start_date, dateRange.end_date, searchTerm, selectedWorkplaceName, filters.type]);

    // Fetch attendance data from API with proper filters
    // Pass query parameters directly to ensure React Query tracks all changes
    const { data: attendanceData, isLoading, refetch } = useGetAdminAttendanceHistoryQuery(queryParams, {
        skip: false, // Always fetch
        refetchOnMountOrArgChange: true, // Refetch when arguments change
        refetchOnMount: true, // Refetch on mount
    });

    // Transform API data to match component format
    const transformedData = useMemo(() => {
        if (!attendanceData?.data?.records) return [];
        
        return attendanceData.data.records
            .filter((record) => record.id) // Filter out records without IDs
            .map((record) => {
            // Handle check_in_time and check_out_time - they might be strings in HH:mm:ss format
            let checkInTime = null;
            let checkOutTime = null;
            
            if (record.check_in_time) {
                // If it's a date string with time, parse it
                if (typeof record.check_in_time === 'string' && record.check_in_time.includes(' ')) {
                    checkInTime = moment(record.check_in_time);
                } else if (record.date && record.check_in_time) {
                    // Combine date and time if they're separate
                    checkInTime = moment(`${record.date} ${record.check_in_time}`);
                } else {
                    checkInTime = moment(record.check_in_time);
                }
            }
            
            if (record.check_out_time) {
                if (typeof record.check_out_time === 'string' && record.check_out_time.includes(' ')) {
                    checkOutTime = moment(record.check_out_time);
                } else if (record.date && record.check_out_time) {
                    checkOutTime = moment(`${record.date} ${record.check_out_time}`);
                } else {
                    checkOutTime = moment(record.check_out_time);
                }
            }
            
            // Determine check-in color (green if on time, red if late, gray if missing)
            let checkInColor = "text-gray-400";
            if (checkInTime && checkInTime.isValid()) {
                const expectedTime = checkInTime.clone().hour(9).minute(15);
                checkInColor = checkInTime.isBefore(expectedTime) ? "text-green-500" : "text-red-500";
            }
            
            // Determine check-out color
            let checkOutColor = "text-gray-400";
            if (checkOutTime && checkOutTime.isValid()) {
                checkOutColor = "text-green-500";
            }

            // Calculate duration
            let duration = "0h 0m";
            if (checkInTime && checkInTime.isValid() && checkOutTime && checkOutTime.isValid()) {
                const diff = moment.duration(checkOutTime.diff(checkInTime));
                const hours = Math.floor(diff.asHours());
                const minutes = diff.minutes();
                duration = `${hours}h ${minutes}m`;
            } else if (record.duration) {
                // Use duration from API if available
                duration = record.duration;
            }

            // Generate initials for avatar
            const employeeName = record.employee_name || record.user?.full_name || "Unknown";
            const nameParts = employeeName.split(" ");
            const initials = nameParts.length >= 2 
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                : nameParts[0]?.[0]?.toUpperCase() || "U";

            // Get consistent avatar color based on name
            const avatarColor = getAvatarColor(employeeName);

            return {
                id: record.id, // Use actual record ID from API - don't use Math.random() as fallback
                name: employeeName,
                initials: initials,
                avatarColor: avatarColor,
                checkIn: {
                    time: checkInTime && checkInTime.isValid() ? checkInTime.format("hh:mm A") : "N/A",
                    date: checkInTime && checkInTime.isValid() ? checkInTime.format("MMM DD, YYYY") : "",
                    color: checkInColor,
                },
                workplace: record.workplace_name || record.workplace?.name || "Unknown",
                checkOut: {
                    time: checkOutTime && checkOutTime.isValid() ? checkOutTime.format("hh:mm A") : "N/A",
                    date: checkOutTime && checkOutTime.isValid() ? checkOutTime.format("MMM DD, YYYY") : "",
                    color: checkOutColor,
                },
                type: record.is_manual ? "Manual" : "QR Scan",
                duration: duration,
                note: record.manager_notes || record.notes || "On Time",
                // Include original record data for action buttons
                is_manual: record.is_manual || false,
                status: record.status || (record.is_manual ? "pending" : "approved"), // Default to pending for manual, approved for QR scan
                recordData: record, // Store full record for API calls
                // Format status for display (capitalize first letter)
                statusDisplay: record.status 
                    ? record.status.charAt(0).toUpperCase() + record.status.slice(1)
                    : (record.is_manual ? "Pending" : "Approved"),
            };
        });
    }, [attendanceData]);


    // Get workplace options for filter dropdown
    const workplaceOptions = useMemo(() => {
        const options = [{ label: t('attendance.allWorkplaces'), value: "" }];
        if (workplacesData?.data?.workplaces) {
            workplacesData.data.workplaces.forEach((wp) => {
                options.push({ label: wp.name, value: wp.id.toString() });
            });
        }
        return options;
    }, [workplacesData, t]);

    const filterConfig = React.useMemo(() => [
        {
            key: "workplace",
            label: t('attendance.allWorkplaces') || "Workplace",
            options: workplaceOptions,
        },
        {
            key: "type",
            label: t('attendance.type') || "Type",
            options: [
                { label: "All Types", value: "" },
                { label: "QR Scan", value: "qr_scan" },
                { label: "Manual", value: "manual" }
            ]
        }
    ], [t, workplaceOptions]);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };
            // Reset page when filters change
            setCurrentPage(1);
            return newFilters;
        });
    }, []);

    const handleSearchChange = useCallback((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    // Handlers for approve/reject actions
    const handleApproveClick = useCallback((row) => {
        setSelectedRecord(row);
        setIsApproveModalOpen(true);
    }, []);

    const handleRejectClick = useCallback((row) => {
        setSelectedRecord(row);
        setIsRejectModalOpen(true);
    }, []);

    const closeModals = () => {
        setIsApproveModalOpen(false);
        setIsRejectModalOpen(false);
        setSelectedRecord(null);
    };

    const confirmApprove = async () => {
        if (!selectedRecord) return;
        
        // Get the actual record ID - prioritize recordData.id (from API) over transformed id
        const recordId = selectedRecord.recordData?.id || selectedRecord.id;
        
        if (!recordId) {
            toast.error("Invalid attendance record ID");
            return;
        }
        
        try {
            await updateAttendanceRecordStatus({
                id: recordId,
                data: { status: "approved" }
            }).unwrap();
            toast.success("Manual attendance request approved successfully");
            refetch();
            closeModals();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to approve manual attendance request");
        }
    };

    const confirmReject = async (reason) => {
        if (!selectedRecord) return;
        
        // Get the actual record ID - prioritize recordData.id (from API) over transformed id
        const recordId = selectedRecord.recordData?.id || selectedRecord.id;
        
        if (!recordId) {
            toast.error("Invalid attendance record ID");
            return;
        }
        
        try {
            await updateAttendanceRecordStatus({
                id: recordId,
                data: { status: "rejected", notes: reason }
            }).unwrap();
            toast.success("Manual attendance request rejected successfully");
            refetch();
            closeModals();
        } catch (error) {
            toast.error(error?.data?.message || "Failed to reject manual attendance request");
        }
    };

    // Use API data only - no fallback
    const currentTableData = transformedData;
    const totalItems = attendanceData?.data?.pagination?.total || 0;
    const totalPages = attendanceData?.data?.pagination?.pages || 0;
    
    // Get total worked hours from monthly metrics API
    const totalWorkedHours = useMemo(() => {
        if (monthlyMetricsData?.data?.total_worked_this_month) {
            const { hours, minutes } = monthlyMetricsData.data.total_worked_this_month;
            return `${hours || 0}h ${minutes || 0}m`;
        }
        // Fallback: Calculate from current page data if metrics not available
        if (attendanceData?.data?.total_working_hours) {
            return attendanceData.data.total_working_hours;
        }
        return "0h 0m";
    }, [monthlyMetricsData, attendanceData]);

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
            render: (row) => {
                const avatarColor = row.avatarColor || getAvatarColor(row.name);
                return (
                    <div className="flex items-center gap-3 py-2">
                        <div className={`w-10 h-10 rounded-full ${avatarColor.bg} ${avatarColor.text} flex items-center justify-center text-sm font-bold shrink-0 shadow-sm`}>
                            {row.initials || "U"}
                        </div>
                        <span className="text-[#374151] font-bold text-[0.8125rem] whitespace-nowrap">{row.name}</span>
                    </div>
                );
            }
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
            minWidth: "15rem", // 240px - increased minimum width to accommodate longer names
            wrap: false, // Prevent text wrapping
            style: {
                overflow: "visible", // Allow content to expand beyond cell
                whiteSpace: "nowrap", // Prevent text wrapping
            },
            render: (row) => (
                <div className="flex items-center gap-2 min-w-max">
                    <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
                    <span className="text-gray-500 font-medium text-[0.8125rem] whitespace-nowrap">{row.workplace}</span>
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
            key: "status",
            label: t('map.status') || "Status",
            width: "120px",
            render: (row) => {
                // Only show status if it exists and has a value
                if (!row.statusDisplay && !row.status) return null;
                
                const status = row.statusDisplay || (row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "");
                let bgClass = "bg-orange-50 text-orange-500";
                let icon = <Clock size={12} />;
                
                if (status === "Approved" || status?.toLowerCase() === "approved") {
                    bgClass = "bg-green-50 text-green-500";
                    icon = <Check size={12} />;
                } else if (status === "Rejected" || status?.toLowerCase() === "rejected") {
                    bgClass = "bg-red-50 text-red-500";
                    icon = <X size={12} />;
                }
                
                return (
                    <span className={`px-3 py-1 rounded-full ${bgClass} text-[11px] font-bold flex items-center gap-1 w-fit`}>
                        {icon} {status}
                    </span>
                );
            }
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
        },
        {
            key: "actions",
            label: t('common.actions'),
            width: "220px",
            render: (row) => {
                // Only show action buttons for manual attendance records with pending status
                // Show buttons if status is explicitly "pending", or if status is not provided (assume pending for manual records)
                // Don't show buttons if status is "approved" or "rejected"
                const status = row.status?.toLowerCase();
                const shouldShowActions = row.is_manual && (
                    status === "pending" || 
                    (status !== "approved" && status !== "rejected" && (row.status === undefined || row.status === null || !row.status))
                );
                
                if (shouldShowActions) {
                    return (
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => handleApproveClick(row)} 
                                className="flex items-center gap-1 px-4 py-1.5 bg-[#22B3E8] hover:bg-[#1fa0d1] text-white rounded-lg text-xs font-bold transition-colors"
                                disabled={isUpdating}
                            >
                                <Check size={14} /> {t('common.approve')}
                            </button>
                            <button 
                                onClick={() => handleRejectClick(row)} 
                                className="flex items-center gap-1 px-4 py-1.5 bg-[#EF4444] hover:bg-[#d42d2d] text-white rounded-lg text-xs font-bold transition-colors"
                                disabled={isUpdating}
                            >
                                <X size={14} /> {t('common.reject')}
                            </button>
                        </div>
                    );
                }
                return null;
            }
        }
    ], [t, isUpdating, handleApproveClick, handleRejectClick]);

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            {/* Header Section */}
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <h2 className="text-[#111827] text-xl font-bold font-inter">{t('attendance.employeeAttendance')}</h2>
                    <div className="flex flex-col items-end">
                        <span className="text-[#111827] text-2xl font-bold font-inter tracking-tight">
                            {isLoading ? "..." : totalWorkedHours}
                        </span>
                        <span className="text-gray-400 text-[10px] font-medium font-inter">{t('attendance.totalWorkedHours')}</span>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="w-full space-y-4">
                    <ReusableFilter
                        searchConfig={{ placeholder: t('employee.searchEmployee') || "Search by employee name" }}
                        filters={filterConfig}
                        data={transformedData}
                        onFilterChange={handleFilterChange}
                        onSearchChange={handleSearchChange}
                        className="w-full flex flex-col gap-4"
                        searchClassName="w-full"
                        filterClassName="flex flex-col sm:flex-row flex-wrap gap-3 w-full"
                        dropdownClassName="min-w-[150px] w-full sm:w-auto"
                        layout="vertical"
                        fullWidth={true}
                    />
                    
                    {/* Date Range Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="w-full sm:flex-1 sm:max-w-[48%]">
                            <FlowbiteDatePicker
                                label="Start Date"
                                value={filters.start_date}
                                onChange={(e) => handleFilterChange("start_date", e.target.value)}
                                placeholder="Select start date"
                                maxDate={filters.end_date || undefined}
                                containerClasses="w-full"
                            />
                        </div>
                        <div className="w-full sm:flex-1 sm:max-w-[48%]">
                            <FlowbiteDatePicker
                                label="End Date"
                                value={filters.end_date}
                                onChange={(e) => handleFilterChange("end_date", e.target.value)}
                                placeholder="Select end date"
                                minDate={filters.start_date || undefined}
                                containerClasses="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full overflow-x-auto">
                <style>{`
                    /* Allow workplace column to expand for long content */
                    .rdt_Table .rdt_TableBody .rdt_TableRow .rdt_TableCell:nth-child(4),
                    .rdt_Table .rdt_TableHead .rdt_TableHeadRow .rdt_TableHeadCell:nth-child(4) {
                        overflow: visible !important;
                        white-space: nowrap !important;
                        min-width: 15rem;
                    }
                `}</style>
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

            {/* Modals */}
            <ApproveModal
                isOpen={isApproveModalOpen}
                onClose={closeModals}
                onConfirm={confirmApprove}
                t={t}
            />
            <RejectModal
                isOpen={isRejectModalOpen}
                onClose={closeModals}
                onConfirm={confirmReject}
                t={t}
            />
        </div>
    );
};

// Approve Modal Component
const ApproveModal = ({ isOpen, onClose, onConfirm, t }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2 font-inter">{t('request.approveModalTitle') || "Approve Manual Attendance Request"}</h3>
                <p className="text-center text-gray-600 mb-8 font-medium">{t('request.approveModalDesc') || "Are you sure you want to approve this manual attendance request?"}</p>
                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">{t('common.cancel') || "Cancel"}</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-[#22B3E8] rounded-xl font-bold text-white hover:bg-[#1fa0d1] shadow-lg shadow-sky-100 transition-colors">{t('common.confirm') || "Confirm"}</button>
                </div>
            </div>
        </div>
    );
};

// Reject Modal Component
const RejectModal = ({ isOpen, onClose, onConfirm, t }) => {
    const [reason, setReason] = useState("");

    // Reset reason when modal opens
    React.useEffect(() => {
        if (isOpen) setReason("");
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-[450px] shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2 font-inter">{t('request.rejectModalTitle') || "Reject Manual Attendance Request"}</h3>
                <p className="text-center text-gray-600 mb-6 font-medium">{t('request.rejectModalDesc') || "Are you sure you want to reject this manual attendance request? Please provide a reason."}</p>

                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-900 mb-2">{t('request.rejectionReason') || "Rejection Reason"}</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason"
                        className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-gray-700 font-medium placeholder-gray-400"
                    />
                </div>

                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">{t('common.cancel') || "Cancel"}</button>
                    <button onClick={() => onConfirm(reason)} className="flex-1 py-3 bg-[#22B3E8] rounded-xl font-bold text-white hover:bg-[#1fa0d1] shadow-lg shadow-sky-100 transition-colors">{t('common.confirm') || "Confirm"}</button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;
