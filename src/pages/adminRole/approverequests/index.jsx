import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Clock, Calendar, Filter } from "lucide-react";
import DashboardBanner from "../../../components/DashboardBanner";
import ReusableDataTable from "../../../components/ReusableDataTable";
import ReusablePagination from "../../../components/ReusablePagination";
import Select from "../../../components/Form/Select";

// Mock Data
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

    const confirmApprove = () => {
        console.log("Approved request:", selectedRequest);
        closeModals();
    };

    const confirmReject = (reason) => {
        console.log("Rejected request:", selectedRequest, "Reason:", reason);
        closeModals();
    };

    // Filters State
    const [filters, setFilters] = useState({
        status: "All Requests",
        type: "All Types",
        department: "All Departments"
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Filter Options
    const statusOptions = [{ label: t('common.all'), value: "All Requests" }, { label: t('status.pending'), value: "Pending" }];
    const typeOptions = [{ label: t('common.all'), value: "All Types" }, { label: "Annual Leave", value: "Annual Leave" }];
    const deptOptions = [{ label: t('employee.allDepartments'), value: "All Departments" }, { label: "Engineering", value: "Engineering" }];

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
                if (row.leaveType === "Maternity Leave") bgClass = "bg-pink-50 text-pink-600";

                return (
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 w-fit ${bgClass}`}>
                        {row.leaveType === "Annual Leave" && "✈️"}
                        {row.leaveType === "Sick Leave" && "❤️"}
                        {row.leaveType === "Personal Leave" && "👤"}
                        {row.leaveType === "Maternity Leave" && "👶"}
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
            render: (row) => (
                <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-500 text-[11px] font-bold flex items-center gap-1 w-fit">
                    <Clock size={12} /> {row.status}
                </span>
            )
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
                    <StatCard title={t('request.pendingRequests')} value="24" icon={Clock} iconBg="bg-blue-50" iconColor="text-blue-500" />
                    <StatCard title={t('request.approvedToday')} value="12" icon={Check} iconBg="bg-green-50" iconColor="text-green-500" />
                    <StatCard title={t('request.rejectedToday')} value="3" icon={X} iconBg="bg-red-50" iconColor="text-red-500" />
                    <StatCard title={t('request.totalMonth')} value="156" icon={Calendar} iconBg="bg-sky-50" iconColor="text-sky-500" />
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
                    {/* Filters Bar */}
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <div className="w-full md:w-48 space-y-1">
                                <label className="text-gray-600 text-[11px] font-bold pl-1">{t('map.status')}</label>
                                <Select options={statusOptions} value={filters.status} name="status" onChange={handleFilterChange} className="w-full h-10 text-sm bg-white" />
                            </div>
                            <div className="w-full md:w-48 space-y-1">
                                <label className="text-gray-600 text-[11px] font-bold pl-1">{t('request.leaveType')}</label>
                                <Select options={typeOptions} value={filters.type} name="type" onChange={handleFilterChange} className="w-full h-10 text-sm bg-white" />
                            </div>
                            <div className="w-full md:w-48 space-y-1">
                                <label className="text-gray-600 text-[11px] font-bold pl-1">{t('employee.department')}</label>
                                <Select options={deptOptions} value={filters.department} name="department" onChange={handleFilterChange} className="w-full h-10 text-sm bg-white" />
                            </div>
                        </div>

                        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#22B3E8] hover:bg-[#1fa0d1] text-white rounded-xl text-sm font-bold shadow-sm shadow-sky-100 whitespace-nowrap">
                            <Filter size={16} /> {t('request.applyFilters')}
                        </button>
                    </div>

                    {/* Data Table */}
                    <div className="w-full">
                        <ReusableDataTable
                            columns={columns}
                            data={leaveRequestsData}
                        />
                        <div className="border-t border-gray-100">
                            <ReusablePagination
                                totalItems={leaveRequestsData.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                                totalPages={1}
                            />
                        </div>
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
            <p className="text-gray-400 text-xs font-bold mb-1">{title}</p>
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
