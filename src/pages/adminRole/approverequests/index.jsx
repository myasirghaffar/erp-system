import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Clock, Calendar, Filter } from "lucide-react";
import DashboardBanner from "../../../components/DashboardBanner";
import ReusableDataTable from "../../../components/ReusableDataTable";
import ReusablePagination from "../../../components/ReusablePagination";
import Select from "../../../components/Form/Select";
import {
    useGetAllLeaveRequestsQuery,
    useGetLeaveRequestStatisticsQuery,
    useUpdateLeaveRequestStatusMutation,
} from "../../../services/Api";
import { toast } from "react-toastify";
import moment from "moment";

// Mapping functions for leave types (backend values <-> display names)
const leaveTypeMap = {
    'vacation': 'Annual Leave',
    'sick': 'Sick Leave',
    'personal': 'Personal Leave',
    'other': 'Other'
};

const leaveTypeReverseMap = {
    'Annual Leave': 'vacation',
    'Sick Leave': 'sick',
    'Personal Leave': 'personal',
    'Other': 'other'
};

const getLeaveTypeDisplay = (backendValue) => {
    return leaveTypeMap[backendValue] || backendValue || 'Annual Leave';
};

const getLeaveTypeBackend = (displayValue) => {
    return leaveTypeReverseMap[displayValue] || displayValue;
};

// Mock Data (fallback)
const leaveRequestsData = [
    {
        id: 1,
        employee: { name: "Sarah Johnson", role: "Engineering", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
        leaveType: "Annual Leave",
        dateRange: { start: "Dec 20", end: "Dec 27, 2024", applied: "Applied 2 days ago" },
        duration: "7 days",
        status: "Pending"
    },
    {
        id: 2,
        employee: { name: "Michael Chen", role: "Marketing", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        leaveType: "Sick Leave",
        dateRange: { start: "Dec 18", end: "Dec 19, 2024", applied: "Applied 1 day ago" },
        duration: "2 days",
        status: "Pending"
    },
    {
        id: 3,
        employee: { name: "Emily Davis", role: "Sales", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
        leaveType: "Personal Leave",
        dateRange: { start: "Dec 22", end: "Dec 24, 2024", applied: "Applied 3 hours ago" },
        duration: "3 days",
        status: "Pending"
    },
    {
        id: 4,
        employee: { name: "David Martinez", role: "Engineering", avatar: "https://randomuser.me/api/portraits/men/86.jpg" },
        leaveType: "Annual Leave",
        dateRange: { start: "Jan 2", end: "Jan 5, 2025", applied: "Applied 5 hours ago" },
        duration: "4 days",
        status: "Pending"
    },
    {
        id: 5,
        employee: { name: "Lisa Anderson", role: "HR", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
        leaveType: "Maternity Leave",
        dateRange: { start: "Jan 10", end: "Apr 10, 2025", applied: "Applied 1 week ago" },
        duration: "90 days",
        status: "Pending"
    },
    {
        id: 6,
        employee: { name: "Robert Wilson", role: "Sales", avatar: "https://randomuser.me/api/portraits/men/46.jpg" },
        leaveType: "Annual Leave",
        dateRange: { start: "Dec 26", end: "Dec 30, 2024", applied: "Applied 6 hours ago" },
        duration: "5 days",
        status: "Pending"
    }
];

const ApproveRequests = () => {
    const { t } = useTranslation();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    // Filters State
    const [filters, setFilters] = useState({
        status: "Pending",
        type: "All Types"
    });

    // Prepare API query parameters
    const apiParams = useMemo(() => {
        const params = {
            page: currentPage,
            limit: itemsPerPage
        };

        // Map status filter - backend expects lowercase: pending, approved, rejected
        if (filters.status && filters.status !== "All Requests") {
            params.status = filters.status.toLowerCase();
        }

        // Map type filter - convert display name to backend value
        if (filters.type && filters.type !== "All Types") {
            params.type = getLeaveTypeBackend(filters.type);
        }

        return params;
    }, [currentPage, filters]);

    // Fetch leave requests from API
    const { data: leaveRequestsData, isLoading, refetch } = useGetAllLeaveRequestsQuery(apiParams);

    // Fetch statistics
    const { data: statisticsData } = useGetLeaveRequestStatisticsQuery();

    // Mutation
    const [updateLeaveRequestStatus, { isLoading: isUpdating }] = useUpdateLeaveRequestStatusMutation();

    // Transform API data
    const transformedData = useMemo(() => {
        if (!leaveRequestsData?.data?.requests) return leaveRequestsData || [];
        
        return leaveRequestsData.data.requests.map((request) => {
            const startDate = moment(request.start_date);
            const endDate = moment(request.end_date);
            const duration = endDate.diff(startDate, 'days') + 1;
            
            // Map backend status to display format (capitalize first letter)
            const statusDisplay = request.status 
                ? request.status.charAt(0).toUpperCase() + request.status.slice(1)
                : "Pending";
            
            // Map backend type to display name
            const leaveTypeDisplay = getLeaveTypeDisplay(request.type);
            
            return {
                id: request.id,
                employee: {
                    name: request.user?.full_name || "Unknown",
                    role: request.user?.position || request.user?.role || "Employee",
                    avatar: request.user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.user?.full_name || "Unknown")}`,
                },
                leaveType: leaveTypeDisplay,
                dateRange: {
                    start: startDate.format("MMM DD"),
                    end: endDate.format("MMM DD, YYYY"),
                    applied: moment(request.created_at).fromNow(),
                },
                duration: `${duration} ${duration === 1 ? 'day' : 'days'}`,
                status: statusDisplay,
                requestData: request,
            };
        });
    }, [leaveRequestsData]);

    const handleApproveClick = (row) => {
        setSelectedRequest(row);
        setIsApproveModalOpen(true);
    };

    const handleRejectClick = (row) => {
        setSelectedRequest(row);
        setIsRejectModalOpen(true);
    };

    const closeModals = () => {
        setIsApproveModalOpen(false);
        setIsRejectModalOpen(false);
        setSelectedRequest(null);
    };

    const confirmApprove = async () => {
        if (!selectedRequest) return;
        
        try {
            await updateLeaveRequestStatus({
                id: selectedRequest.id || selectedRequest.requestData?.id,
                data: { status: "approved" }
            }).unwrap();
            toast.success(t('request.approveSuccess') || "Leave request approved successfully");
            refetch();
            closeModals();
        } catch (error) {
            toast.error(error?.data?.message || t('request.approveError') || "Failed to approve request");
        }
    };

    const confirmReject = async (reason) => {
        if (!selectedRequest) return;
        
        try {
            await updateLeaveRequestStatus({
                id: selectedRequest.id || selectedRequest.requestData?.id,
                data: { status: "rejected", rejection_reason: reason }
            }).unwrap();
            toast.success(t('request.rejectSuccess') || "Leave request rejected successfully");
            refetch();
            closeModals();
        } catch (error) {
            toast.error(error?.data?.message || t('request.rejectError') || "Failed to reject request");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    // Get statistics from API
    const stats = useMemo(() => {
        if (!statisticsData?.data) {
            return {
                pending: 24,
                approvedToday: 12,
                rejectedToday: 3,
                totalMonth: 156,
            };
        }
        
        return {
            pending: statisticsData.data.pending || 0,
            approvedToday: statisticsData.data.approved_today || 0,
            rejectedToday: statisticsData.data.rejected_today || 0,
            totalMonth: statisticsData.data.total_this_month || 0,
        };
    }, [statisticsData]);

    // Filter Options
    const statusOptions = [
        { label: "All Requests", value: "All Requests" },
        { label: "Pending", value: "Pending" },
        { label: "Approved", value: "Approved" },
        { label: "Rejected", value: "Rejected" }
    ];
    
    const typeOptions = [
        { label: t('common.all'), value: "All Types" },
        { label: "Annual Leave", value: "Annual Leave" },
        { label: "Sick Leave", value: "Sick Leave" },
        { label: "Personal Leave", value: "Personal Leave" },
        { label: "Other", value: "Other" }
    ];

    // Columns Definition
    const columns = [
        {
            key: "selection",
            label: "",
            width: "50px",
            render: () => (
                <div className="flex justify-center w-full">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer" />
                </div>
            )
        },
        {
            key: "employee",
            label: t('map.employees'),
            minWidth: "250px",
            render: (row) => (
                <div className="flex items-center gap-3 py-2">
                    <img src={row.employee.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex flex-col">
                        <span className="text-[#111827] font-bold text-[14px]">{row.employee.name}</span>
                        <span className="text-gray-400 text-[12px] font-medium">{row.employee.role}</span>
                    </div>
                </div>
            )
        },
        {
            key: "leaveType",
            label: t('request.leaveType'),
            minWidth: "150px",
            render: (row) => {
                let bgClass = "bg-blue-50 text-blue-600";
                if (row.leaveType === "Sick Leave") bgClass = "bg-red-50 text-red-600";
                if (row.leaveType === "Personal Leave") bgClass = "bg-purple-50 text-purple-600";
                if (row.leaveType === "Other") bgClass = "bg-gray-50 text-gray-600";

                const getIcon = () => {
                    if (row.leaveType === "Annual Leave") return "✈️";
                    if (row.leaveType === "Sick Leave") return "❤️";
                    if (row.leaveType === "Personal Leave") return "👤";
                    if (row.leaveType === "Other") return "📋";
                    return "";
                };

                return (
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 w-fit ${bgClass}`}>
                        {getIcon()}
                        {row.leaveType}
                    </span>
                );
            }
        },
        {
            key: "dateRange",
            label: t('request.dateRange'),
            minWidth: "200px",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[#111827] font-bold text-[13px]">{row.dateRange.start} - {row.dateRange.end}</span>
                    <span className="text-gray-400 text-[11px] font-medium">{row.dateRange.applied}</span>
                </div>
            )
        },
        {
            key: "duration",
            label: t('request.duration'),
            width: "120px",
            render: (row) => <span className="text-[#374151] font-semibold text-[13px]">{row.duration}</span>
        },
        {
            key: "status",
            label: t('map.status'),
            width: "120px",
            render: (row) => {
                let bgClass = "bg-orange-50 text-orange-500";
                let icon = <Clock size={12} />;
                
                if (row.status === "Approved") {
                    bgClass = "bg-green-50 text-green-500";
                    icon = <Check size={12} />;
                } else if (row.status === "Rejected") {
                    bgClass = "bg-red-50 text-red-500";
                    icon = <X size={12} />;
                }
                
                return (
                    <span className={`px-3 py-1 rounded-full ${bgClass} text-[11px] font-bold flex items-center gap-1 w-fit`}>
                        {icon} {row.status}
                    </span>
                );
            }
        },
        {
            key: "actions",
            label: t('common.actions'),
            width: "220px",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => handleApproveClick(row)} className="flex items-center gap-1 px-4 py-1.5 bg-[#22B3E8] hover:bg-[#1fa0d1] text-white rounded-lg text-xs font-bold transition-colors">
                        <Check size={14} /> {t('common.approve')}
                    </button>
                    <button onClick={() => handleRejectClick(row)} className="flex items-center gap-1 px-4 py-1.5 bg-[#EF4444] hover:bg-[#d42d2d] text-white rounded-lg text-xs font-bold transition-colors">
                        <X size={14} /> {t('common.reject')}
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
            <div className="space-y-6 max-w-full">
                <DashboardBanner
                    title={t('request.leaveTitle')}
                    description={t('request.description')}
                />


                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title={t('request.pendingRequests')} value={stats.pending.toString()} icon={Clock} iconBg="bg-blue-50" iconColor="text-blue-500" />
                    <StatCard title={t('request.approvedToday')} value={stats.approvedToday.toString()} icon={Check} iconBg="bg-green-50" iconColor="text-green-500" />
                    <StatCard title={t('request.rejectedToday')} value={stats.rejectedToday.toString()} icon={X} iconBg="bg-red-50" iconColor="text-red-500" />
                    <StatCard title={t('request.totalMonth')} value={stats.totalMonth.toString()} icon={Calendar} iconBg="bg-sky-50" iconColor="text-sky-500" />
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
                    {/* Filters Bar */}
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <div className="w-full md:w-48 space-y-1">
                                <label className="text-gray-700 text-[11px] font-bold pl-1">{t('map.status')}</label>
                                <Select options={statusOptions} value={filters.status} name="status" onChange={handleFilterChange} className="w-full h-10 text-sm bg-white" />
                            </div>
                            <div className="w-full md:w-48 space-y-1">
                                <label className="text-gray-700 text-[11px] font-bold pl-1">{t('request.leaveType')}</label>
                                <Select options={typeOptions} value={filters.type} name="type" onChange={handleFilterChange} className="w-full h-10 text-sm bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="w-full">
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-500">{t('common.loading') || "Loading..."}</div>
                        ) : (
                            <>
                                <ReusableDataTable
                                    columns={columns}
                                    data={transformedData}
                                />
                                <div className="border-t border-gray-100">
                                    <ReusablePagination
                                        totalItems={leaveRequestsData?.data?.pagination?.total || transformedData.length}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={setCurrentPage}
                                        totalPages={leaveRequestsData?.data?.pagination?.totalPages || Math.ceil(transformedData.length / itemsPerPage)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
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

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-gray-700 text-xs font-semibold mb-1">{title}</p>
            <h3 className="text-[#111827] text-2xl font-bold">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
            <Icon size={20} strokeWidth={2.5} />
        </div>
    </div>
);

const ApproveModal = ({ isOpen, onClose, onConfirm, t }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2 font-inter">{t('request.approveModalTitle')}</h3>
                <p className="text-center text-gray-600 mb-8 font-medium">{t('request.approveModalDesc')}</p>
                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">{t('common.cancel')}</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-[#22B3E8] rounded-xl font-bold text-white hover:bg-[#1fa0d1] shadow-lg shadow-sky-100 transition-colors">{t('common.confirm')}</button>
                </div>
            </div>
        </div>
    )
}

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
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-2 font-inter">{t('request.rejectModalTitle')}</h3>
                <p className="text-center text-gray-600 mb-6 font-medium">{t('request.rejectModalDesc')}</p>

                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-900 mb-2">{t('request.rejectionReason')}</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter"
                        className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-gray-700 font-medium placeholder-gray-400"
                    />
                </div>

                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">{t('common.cancel')}</button>
                    <button onClick={() => onConfirm(reason)} className="flex-1 py-3 bg-[#22B3E8] rounded-xl font-bold text-white hover:bg-[#1fa0d1] shadow-lg shadow-sky-100 transition-colors">{t('common.confirm')}</button>
                </div>
            </div>
        </div>
    )
}

export default ApproveRequests;
