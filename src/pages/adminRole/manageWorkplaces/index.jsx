import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Download, Eye, Trash2, MapPin, Building2, QrCode, X, Search, ChevronDown } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import * as XLSX from 'xlsx';
import DashboardBanner from "../../../components/DashboardBanner";
import ReusableDataTable from "../../../components/ReusableDataTable";
import ReusablePagination from "../../../components/ReusablePagination";
import ReusableFilter from "../../../components/ReusableFilter";
import FlowbiteDatePicker from "../../../components/FlowbiteDatePicker";
import AddWorkplace from "./features/AddWorkplace";
import WorkPlaceQrForm from "./features/workPlaceQrForm";
import QrCodeDetail from "./features/QrCodeDetail";
import WorkplaceQRCodeModal from "./features/WorkplaceQRCodeModal";
import ConfirmModal from "../../../components/ConfirmModal";
import {
    useGetAllWorkplacesQuery,
    useGetAllQRCodesQuery,
    useDeleteWorkplaceMutation,
    useDeleteQRCodeMutation,
} from "../../../services/Api";
import { toast } from "react-toastify";
import api from "../../../utils/axios";
import { API_END_POINTS } from "../../../services/ApiEndpoints";

const itemsPerPage = 4;
const qrItemsPerPage = 5;

const WorkplaceManagement = () => {
    const { t } = useTranslation();
    const [view, setView] = useState("list");
    const [currentPage, setCurrentPage] = useState(1);
    const [qrCurrentPage, setQrCurrentPage] = useState(1);
    const [selectedQr, setSelectedQr] = useState(null);
    const [selectedWorkplace, setSelectedWorkplace] = useState(null);
    const [qrTab, setQrTab] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [dateRangeStart, setDateRangeStart] = useState("");
    const [dateRangeEnd, setDateRangeEnd] = useState("");
    // QR code filters
    const [qrSearchTerm, setQrSearchTerm] = useState("");
    const [qrExpiredFilter, setQrExpiredFilter] = useState("");
    const [qrDateRangeStart, setQrDateRangeStart] = useState("");
    const [qrDateRangeEnd, setQrDateRangeEnd] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [workplaceToDelete, setWorkplaceToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [internalOpenDropdowns, setInternalOpenDropdowns] = useState({});
    const openDropdowns = internalOpenDropdowns;
    const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);
    const [selectedWorkplaceQrCode, setSelectedWorkplaceQrCode] = useState(null);
    const [selectedWorkplaceForQr, setSelectedWorkplaceForQr] = useState(null);
    const [isLoadingQrCode, setIsLoadingQrCode] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".filter-dropdown")) {
                setInternalOpenDropdowns({});
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Build date_range parameter for workplaces
    const dateRange = useMemo(() => {
        if (dateRangeStart && dateRangeEnd) {
            return `${dateRangeStart},${dateRangeEnd}`;
        }
        return undefined;
    }, [dateRangeStart, dateRangeEnd]);

    // Build date_range parameter for QR codes
    const qrDateRange = useMemo(() => {
        if (qrDateRangeStart && qrDateRangeEnd) {
            return `${qrDateRangeStart},${qrDateRangeEnd}`;
        }
        return undefined;
    }, [qrDateRangeStart, qrDateRangeEnd]);

    // Fetch workplaces and QR codes from API
    const { data: workplacesData, isLoading: isLoadingWorkplaces, refetch: refetchWorkplaces } = useGetAllWorkplacesQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        location: locationFilter || undefined,
        date_range: dateRange,
    });

    const { data: qrCodesData, isLoading: isLoadingQRCodes, refetch: refetchQRCodes } = useGetAllQRCodesQuery({
        page: qrCurrentPage,
        limit: qrItemsPerPage,
        status: qrTab === "All" ? undefined : qrTab.toLowerCase(),
        search: qrSearchTerm || undefined,
        expired: qrExpiredFilter === "" ? undefined : qrExpiredFilter === "true",
        date_range: qrDateRange,
    });

    // Mutations
    const [deleteWorkplace] = useDeleteWorkplaceMutation();
    const [deleteQRCode] = useDeleteQRCodeMutation();

    // Transform workplaces data
    const transformedWorkplaces = useMemo(() => {
        if (!workplacesData?.data?.workplaces) return [];
        
        return workplacesData.data.workplaces.map((wp) => ({
            id: wp.id,
            name: wp.name,
            type: wp.type || "Office",
            address: wp.address || "",
            radius: `${wp.geofence_radius || wp.radius || 0}m`,
            checkIns: wp.today_check_ins || 0,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            icon: Building2,
            workplaceData: wp,
        }));
    }, [workplacesData]);

    // Transform QR codes data
    const transformedQRCodes = useMemo(() => {
        if (!qrCodesData?.data?.qrCodes) return [];
        
        return qrCodesData.data.qrCodes.map((qr) => ({
            id: qr.id,
            qrName: qr.company_name || `QR-${qr.id}`,
            qrId: qr.code || qr.id, // Use secure code field, fallback to id for display
            workplace: qr.workplace?.name || "Unknown",
            created: qr.created_at ? new Date(qr.created_at).toLocaleDateString() + "\n" + new Date(qr.created_at).toLocaleTimeString() : "",
            scans: qr.scan_count || "0",
            status: qr.status === "active" ? "Active" : "Inactive",
            iconBg: qr.status === "active" ? "bg-blue-600" : "bg-gray-600",
            qrData: qr,
        }));
    }, [qrCodesData]);

    // Handle filter changes
    const handleFilterChange = useCallback((key, value) => {
        if (key === "status") {
            setStatusFilter(value);
        } else if (key === "location") {
            setLocationFilter(value);
        }
        setCurrentPage(1);
    }, []);

    // Handle date range changes
    const handleDateRangeChange = useCallback((start, end) => {
        setDateRangeStart(start);
        setDateRangeEnd(end);
        setCurrentPage(1);
    }, []);

    // Handle search change
    const handleSearchChange = useCallback((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    // Handle QR code search change
    const handleQrSearchChange = useCallback((value) => {
        setQrSearchTerm(value);
        setQrCurrentPage(1);
    }, []);

    // Handle QR code date range changes
    const handleQrDateRangeChange = useCallback((start, end) => {
        setQrDateRangeStart(start);
        setQrDateRangeEnd(end);
        setQrCurrentPage(1);
    }, []);

    // Handle QR code expired filter change
    const handleQrExpiredFilterChange = useCallback((value) => {
        setQrExpiredFilter(value);
        setQrCurrentPage(1);
    }, []);

    // Handle delete workplace - open modal
    const handleDeleteWorkplace = useCallback((workplaceId) => {
        setWorkplaceToDelete(workplaceId);
        setDeleteModalOpen(true);
    }, []);

    // Confirm delete workplace
    const confirmDeleteWorkplace = useCallback(async () => {
        if (!workplaceToDelete) return;
        
        setIsDeleting(true);
        try {
            await deleteWorkplace(workplaceToDelete).unwrap();
            toast.success(t('workplace.deleteSuccess') || "Workplace deleted successfully");
            refetchWorkplaces();
            setDeleteModalOpen(false);
            setWorkplaceToDelete(null);
        } catch (error) {
            toast.error(error?.data?.message || t('workplace.deleteError') || "Failed to delete workplace");
        } finally {
            setIsDeleting(false);
        }
    }, [workplaceToDelete, deleteWorkplace, refetchWorkplaces, t]);

    // Handle delete QR code
    const handleDeleteQRCode = useCallback(async (qrId) => {
        if (window.confirm(t('qrCode.confirmDelete') || "Are you sure you want to delete this QR code?")) {
            try {
                await deleteQRCode(qrId).unwrap();
                toast.success(t('qrCode.deleteSuccess') || "QR code deleted successfully");
                refetchQRCodes();
            } catch (error) {
                toast.error(error?.data?.message || t('qrCode.deleteError') || "Failed to delete QR code");
            }
        }
    }, [deleteQRCode, refetchQRCodes, t]);

    // Handle view QR code for workplace
    const handleViewWorkplaceQRCode = useCallback(async (workplace) => {
        setIsLoadingQrCode(true);
        setSelectedWorkplaceForQr(workplace);
        
        try {
            // Fetch QR code for this workplace
            const response = await api.get(API_END_POINTS.getAllQRCodes, {
                params: {
                    workplace_id: workplace.id,
                    limit: 1
                }
            });

            const qrCodes = response.data?.data?.qrCodes || [];
            
            if (qrCodes.length > 0) {
                setSelectedWorkplaceQrCode(qrCodes[0]);
                setQrCodeModalOpen(true);
            } else {
                toast.warning(t('workplace.noQrCode') || "No QR code found for this workplace");
            }
        } catch (error) {
            console.error('Error fetching QR code:', error);
            toast.error(error?.response?.data?.message || t('qrCode.fetchError') || "Failed to fetch QR code");
        } finally {
            setIsLoadingQrCode(false);
        }
    }, [t]);

    // Export QR codes to Excel
    const handleExportQRCodes = useCallback(async () => {
        if (isExporting) return; // Prevent multiple clicks
        
        setIsExporting(true);
        try {
            console.log('Export button clicked');
            console.log('XLSX available:', typeof XLSX !== 'undefined' && XLSX.utils);
            
            if (!XLSX || !XLSX.utils) {
                toast.error('Excel library not loaded. Please refresh the page.');
                console.error('XLSX library not available');
                return;
            }

            toast.info(t('common.loading') || "Preparing export...");
            
            // Build query parameters
            const params = {
                page: 1,
                limit: 10000, // High limit to get all QR codes
            };
            
            if (qrTab !== "All") {
                params.status = qrTab.toLowerCase();
            }
            if (qrSearchTerm) {
                params.search = qrSearchTerm;
            }
            if (qrExpiredFilter !== "") {
                params.expired = qrExpiredFilter === "true";
            }
            if (qrDateRange) {
                params.date_range = qrDateRange;
            }

            console.log('Fetching QR codes with params:', params);
            
            // Fetch all QR codes with current filters but with high limit to get all data
            const response = await api.get(API_END_POINTS.getAllQRCodes, { params });
            
            console.log('API Response:', response);

            const qrCodes = response.data?.data?.qrCodes || [];
            
            console.log('QR Codes found:', qrCodes.length);
            
            if (qrCodes.length === 0) {
                toast.warning(t('qrCode.noDataToExport') || "No QR codes found to export");
                return;
            }

            // Transform data for Excel
            const excelData = qrCodes.map((qr, index) => ({
                'No.': index + 1,
                'ID': qr.id,
                'QR Code': qr.code || qr.id,
                'Company Name': qr.company_name || '-',
                'Department': qr.department || '-',
                'Workplace': qr.workplace?.name || '-',
                'Workplace Address': qr.workplace?.address || '-',
                'Email': qr.email || '-',
                'Contact': qr.contact_number || qr.contact || '-',
                'Capacity': qr.capacity || '-',
                'Status': qr.status === 'active' ? 'Active' : 'Inactive',
                'Scan Count': qr.scan_count || 0,
                'Created At': qr.created_at ? new Date(qr.created_at).toLocaleString() : '-',
                'Updated At': qr.updated_at ? new Date(qr.updated_at).toLocaleString() : '-',
                'Expires At': qr.expires_at ? new Date(qr.expires_at).toLocaleString() : '-',
                'Is Expired': qr.expires_at ? (new Date(qr.expires_at) < new Date() ? 'Yes' : 'No') : 'N/A',
            }));

            console.log('Creating Excel file...', 'Data rows:', excelData.length);

            // Create workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(excelData);

            // Set column widths
            const columnWidths = [
                { wch: 5 },  // No.
                { wch: 10 }, // ID
                { wch: 20 }, // QR Code
                { wch: 25 }, // Company Name
                { wch: 20 }, // Department
                { wch: 25 }, // Workplace
                { wch: 30 }, // Workplace Address
                { wch: 30 }, // Email
                { wch: 18 }, // Contact
                { wch: 12 }, // Capacity
                { wch: 12 }, // Status
                { wch: 12 }, // Scan Count
                { wch: 20 }, // Created At
                { wch: 20 }, // Updated At
                { wch: 20 }, // Expires At
                { wch: 12 }, // Is Expired
            ];
            worksheet['!cols'] = columnWidths;

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'QR Codes');

            // Generate filename with current date
            const dateStr = new Date().toISOString().split('T')[0];
            const filename = `QR_Codes_Export_${dateStr}.xlsx`;

            console.log('Writing Excel file:', filename);
            console.log('Workbook:', workbook);
            console.log('Worksheet:', worksheet);

            // Write file and trigger download
            try {
                XLSX.writeFile(workbook, filename);
                console.log('XLSX.writeFile called successfully');
            } catch (writeError) {
                console.error('Error in XLSX.writeFile:', writeError);
                throw writeError;
            }
            
            console.log('Export completed successfully');
            toast.success(t('qrCode.exportSuccess') || `Successfully exported ${qrCodes.length} QR codes`);
        } catch (error) {
            console.error('Export error:', error);
            console.error('Error stack:', error.stack);
            console.error('Error details:', error.response?.data || error.message);
            toast.error(error?.response?.data?.message || error?.message || t('qrCode.exportError') || "Failed to export QR codes");
        } finally {
            setIsExporting(false);
        }
    }, [qrTab, qrSearchTerm, qrExpiredFilter, qrDateRange, t, isExporting]);

    const handleViewQr = (row) => {
        const qr = row.qrData || row;
        const detailedData = {
            id: qr.id || row.id,
            created: row.created ? row.created.replace('\n', ' ') : new Date().toLocaleString(),
            status: row.status,
            companyName: qr.company_name || "Company",
            location: row.workplace,
            department: qr.department || "General",
            capacity: qr.capacity || "N/A",
            contact: qr.contact || "",
            email: qr.email || "",
            qrValue: qr.code || row.qrId, // Use secure code field for QR value
            qrData: qr,
        };
        setSelectedQr(detailedData);
        setView("qrDetail");
    };

    if (view === "qrDetail") {
        return (
            <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
                <QrCodeDetail
                    data={selectedQr}
                    onBack={() => {
                        setView("list");
                        setSelectedQr(null);
                    }}
                    onEdit={() => {
                        setView("generateQR");
                    }}
                />
            </div>
        );
    }

    if (view === "generateQR") {
        return (
            <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
                <WorkPlaceQrForm 
                    onBack={() => {
                        setView("list");
                        setSelectedQr(null);
                    }} 
                    qrCodeId={selectedQr?.qrData?.id || selectedQr?.id}
                    workplaceId={selectedQr?.qrData?.workplace_id}
                />
            </div>
        );
    }

    if (view === "add") {
        return (
            <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
                <AddWorkplace onBack={() => setView("list")} workplaceId={selectedWorkplace?.id} />
            </div>
        );
    }

    // Workplace Pagination from API
    const currentWorkplaceData = transformedWorkplaces;
    const totalItems = workplacesData?.data?.pagination?.total || 0;
    const totalPages = workplacesData?.data?.pagination?.totalPages || Math.ceil(totalItems / itemsPerPage);

    // QR Pagination from API
    const currentQrData = transformedQRCodes;
    const totalQrItems = qrCodesData?.data?.pagination?.total || 0;
    const totalQrPages = qrCodesData?.data?.pagination?.pages || Math.ceil(totalQrItems / qrItemsPerPage);


    const workplaceColumns = [
        {
            key: "name",
            label: t('workplace.name'),
            minWidth: "250px",
            grow: 1,
            render: (row) => (
                <div className="flex items-center gap-3 py-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${row.iconBg}`}>
                        <row.icon className={`w-5 h-5 ${row.iconColor}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#111827] font-bold text-[14px]">{row.name}</span>
                        <span className="text-gray-400 text-[12px] font-medium">{row.type}</span>
                    </div>
                </div>
            )
        },
        {
            key: "address",
            label: t('workplace.address'),
            minWidth: "200px",
            grow: 1,
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[#374151] font-medium text-[13px] whitespace-pre-line">{row.address.split('\n')[0]}</span>
                    <span className="text-gray-400 text-[11px] font-medium">{row.address.split('\n')[1]}</span>
                </div>
            )
        },
        {
            key: "radius",
            label: t('workplace.radius'),
            width: "100px",
            render: (row) => {
                return <span className="px-2.5 py-1 rounded bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-bold">{row.radius}</span>;
            }
        },
        {
            key: "qrCode",
            label: t('qrCode.title'),
            width: "120px",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleViewWorkplaceQRCode(row.workplaceData || { id: row.id, name: row.name })}
                        disabled={isLoadingQrCode}
                        className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center text-purple-500 hover:bg-purple-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                        title={t('qrCode.viewQrCode') || "View QR Code"}
                    >
                        {isLoadingQrCode ? (
                            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <QrCode size={16} />
                        )}
                    </button>
                </div>
            )
        },
        {
            key: "checkIns",
            label: t('attendance.todayCheckIns'),
            width: "180px",
            render: (row) => (
                <div className="flex items-center gap-1">
                    <span className="text-[#111827] font-bold text-[16px]">{row.checkIns}</span>
                    <span className="text-gray-700 text-[12px] font-medium">{t('attendance.checkInsToday')}</span>
                </div>
            )
        },
        {
            key: "actions",
            label: t('common.actions'),
            width: "100px",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => {
                            setSelectedWorkplace(row.workplaceData || { id: row.id });
                            setView("add");
                        }}
                        className="text-amber-500 hover:text-amber-600"
                        title={t('common.edit') || "Edit"}
                    >
                        <Edit size={16} strokeWidth={2} />
                    </button>
                    <button 
                        onClick={() => handleDeleteWorkplace(row.id || row.workplaceData?.id)} 
                        className="text-red-500 hover:text-red-600"
                        title={t('common.delete') || "Delete"}
                    >
                        <Trash2 size={16} strokeWidth={2} />
                    </button>
                </div>
            )
        }
    ];

    // Import Edit icon locally as component
    const Edit = ({ size, strokeWidth }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" /></svg>
    )

    const qrColumns = [
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
            key: "qrName",
            label: t('qrCode.name'),
            minWidth: "200px",
            grow: 1,
            render: (row) => (
                <div className="flex items-center gap-3 py-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${row.iconBg} text-white`}>
                        <QrCode className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#111827] font-bold text-[14px]">{row.qrName}</span>
                        <span className="text-gray-400 text-[11px] font-medium">ID: {row.qrId}</span>
                    </div>
                </div>
            )
        },
        {
            key: "workplace",
            label: t('workplace.title'),
            minWidth: "180px",
            grow: 1,
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-500" />
                    <span className="text-[#374151] font-semibold text-[13px]">{row.workplace}</span>
                </div>
            )
        },
        {
            key: "created",
            label: t('qrCode.createdDate'),
            width: "150px",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-[#374151] font-medium text-[13px]">{row.created.split('\n')[0]}</span>
                    <span className="text-gray-400 text-[11px] font-medium">{row.created.split('\n')[1]}</span>
                </div>
            )
        },
        {
            key: "scans",
            label: t('qrCode.scans'),
            width: "100px",
            render: (row) => <span className="text-[#111827] font-bold text-[13px]">{row.scans}</span>
        },
        {
            key: "status",
            label: t('map.status'),
            width: "100px",
            render: (row) => (
                <div
                    className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center justify-center ${row.status === "Active" ? "bg-green-50 text-green-500" : "bg-gray-100 text-gray-500"
                        }`}
                >
                    {row.status}
                </div>
            )
        },
        {
            key: "actions",
            label: t('common.actions'),
            width: "120px",
            render: (row) => (
                <div className="flex items-center gap-4">
                    <button onClick={() => handleViewQr(row)} className="text-indigo-500 hover:text-indigo-600"><Eye size={16} strokeWidth={2} /></button>
                    <button className="text-blue-500 hover:text-blue-600"><Download size={16} strokeWidth={2} /></button>
                    <button className="text-gray-400 hover:text-gray-600">
                        {/* Kebab menu placeholder */}
                        <div className="flex flex-col gap-[2px]">
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                            <div className="w-1 h-1 bg-current rounded-full"></div>
                        </div>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
            <div className="space-y-6 max-w-full">

                {/* Banner */}
                <DashboardBanner
                    title={t('workplace.managementTitle')}
                    description={t('workplace.managementDesc')}
                    rightContent={
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setView("generateQR")}
                                className="bg-[#22B3E8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus size={16} /> {t('qrCode.generateQrCode')}
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedWorkplace(null);
                                    setView("add");
                                }}
                                className="bg-[#22B3E8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <Plus size={16} /> {t('workplace.addWorkplace')}
                            </button>
                        </div>
                    }
                />

                {/* Filter Bar for Workplaces */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex flex-col gap-4">
                        {/* First Row: Search and Status */}
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            {/* Search Input */}
                            <div className="flex-1 w-full md:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setSearchTerm(value);
                                            handleSearchChange(value);
                                        }}
                                        placeholder={t('workplace.searchPlaceholder') || "Search workplaces..."}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm("");
                                                handleSearchChange("");
                                            }}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Status Dropdown */}
                            <div className="relative filter-dropdown w-full md:w-auto md:min-w-[140px]">
                                <button
                                    onClick={() => {
                                        setInternalOpenDropdowns(prev => ({
                                            ...prev,
                                            status: !prev.status
                                        }));
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors w-full md:w-auto justify-between text-sm ${
                                        statusFilter
                                            ? "bg-primary-50 border-primary-200 text-primary-700"
                                            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                                    }`}
                                >
                                    <span className="font-normal">
                                        {statusFilter === "active" 
                                            ? (t('employee.active') || "Active")
                                            : statusFilter === "inactive"
                                            ? (t('employee.inactive') || "Inactive")
                                            : (t('map.status') || "Status")}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                                            openDropdowns?.status ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {openDropdowns?.status && (
                                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] left-0">
                                        <button
                                            onClick={() => {
                                                handleFilterChange("status", "");
                                                setInternalOpenDropdowns({ status: false });
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                                                !statusFilter ? "bg-primary-50 text-primary-700" : ""
                                            }`}
                                        >
                                            {t('common.all') || "All"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleFilterChange("status", "active");
                                                setInternalOpenDropdowns({ status: false });
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                                                statusFilter === "active" ? "bg-primary-50 text-primary-700" : ""
                                            }`}
                                        >
                                            {t('employee.active') || "Active"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleFilterChange("status", "inactive");
                                                setInternalOpenDropdowns({ status: false });
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                                                statusFilter === "inactive" ? "bg-primary-50 text-primary-700" : ""
                                            }`}
                                        >
                                            {t('employee.inactive') || "Inactive"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Second Row: Location and Date Range */}
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            {/* Location Input Field */}
                            <div className="flex items-center gap-2 flex-1 w-full">
                                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                    {t('workplace.location') || "Location"}:
                                </label>
                                <input
                                    type="text"
                                    value={locationFilter}
                                    onChange={(e) => {
                                        setLocationFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Enter location address..."
                                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                />
                            </div>

                            {/* Date Range Filter */}
                            <div className="flex items-center gap-2 flex-1 w-full">
                                <div className="flex items-center gap-2 flex-1">
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Start Date:
                                    </label>
                                    <div className="flex-1">
                                        <FlowbiteDatePicker
                                            key={`start-${dateRangeEnd}`}
                                            value={dateRangeStart}
                                            onChange={(e) => {
                                                const newStart = e.target.value;
                                                handleDateRangeChange(newStart, dateRangeEnd);
                                            }}
                                            placeholder="Select start date"
                                            maxDate={dateRangeEnd || undefined}
                                            containerClasses="!mb-0"
                                        />
                                    </div>
                                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        End Date:
                                    </label>
                                    <div className="flex-1">
                                        <FlowbiteDatePicker
                                            key={`end-${dateRangeStart}`}
                                            value={dateRangeEnd}
                                            onChange={(e) => {
                                                const newEnd = e.target.value;
                                                handleDateRangeChange(dateRangeStart, newEnd);
                                            }}
                                            placeholder="Select end date"
                                            minDate={dateRangeStart || undefined}
                                            containerClasses="!mb-0"
                                        />
                                    </div>
                                    {(dateRangeStart || dateRangeEnd) && (
                                        <button
                                            onClick={() => handleDateRangeChange("", "")}
                                            className="px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                                            title={t('common.clear') || "Clear"}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Workplace Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="w-full">
                        {isLoadingWorkplaces ? (
                            <div className="p-8 text-center text-gray-500">{t('common.loading') || "Loading..."}</div>
                        ) : (
                            <>
                                <ReusableDataTable
                                    columns={workplaceColumns}
                                    data={currentWorkplaceData}
                                    customStyles={{
                                        headCells: {
                                            style: {
                                                "&:first-of-type": {
                                                    justifyContent: "center",
                                                },
                                            },
                                        },
                                    }}
                                />
                                <div className="border-t border-gray-100">
                                    <ReusablePagination
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={setCurrentPage}
                                        totalPages={totalPages}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pt-6">
                    <div className="px-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-bold text-[#111827]">{t('qrCode.allQrCodes')}</h2>
                            <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                                {["All", "Active", "Inactive"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setQrTab(tab);
                                            setQrCurrentPage(1);
                                        }}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${qrTab === tab ? "bg-white text-[#111827] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                                    >
                                        {tab === "All" ? t('common.all') : tab === "Active" ? t('employee.active') : t('employee.inactive')}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Button clicked, calling handleExportQRCodes');
                                handleExportQRCodes();
                            }}
                            disabled={isExporting}
                            className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="button"
                        >
                            <Download size={16} />
                            {isExporting ? (t('common.loading') || "Exporting...") : t('common.export')}
                        </button>
                    </div>

                    {/* Filter Bar for QR Codes */}
                    <div className="px-6 pb-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex flex-col gap-4">
                                {/* First Row: Search, Status (tab), and Expired Filter */}
                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                    {/* Search Input */}
                                    <div className="flex-1 w-full md:w-auto">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={qrSearchTerm}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setQrSearchTerm(value);
                                                    handleQrSearchChange(value);
                                                }}
                                                placeholder={t('qrCode.searchPlaceholder') || "Search QR codes..."}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                            />
                                            {qrSearchTerm && (
                                                <button
                                                    onClick={() => {
                                                        setQrSearchTerm("");
                                                        handleQrSearchChange("");
                                                    }}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Expired Filter Dropdown */}
                                    <div className="relative filter-dropdown w-full md:w-auto md:min-w-[140px]">
                                        <button
                                            onClick={() => {
                                                setInternalOpenDropdowns(prev => ({
                                                    ...prev,
                                                    qrExpired: !prev.qrExpired
                                                }));
                                            }}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors w-full md:w-auto justify-between text-sm ${
                                                qrExpiredFilter
                                                    ? "bg-primary-50 border-primary-200 text-primary-700"
                                                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                                            }`}
                                        >
                                            <span className="font-normal">
                                                {qrExpiredFilter === "true"
                                                    ? (t('qrCode.expired') || "Expired")
                                                    : qrExpiredFilter === "false"
                                                    ? (t('qrCode.notExpired') || "Not Expired")
                                                    : (t('qrCode.expiredStatus') || "Expired Status")}
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                                                    openDropdowns?.qrExpired ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openDropdowns?.qrExpired && (
                                            <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] left-0">
                                                <button
                                                    onClick={() => {
                                                        handleQrExpiredFilterChange("");
                                                        setInternalOpenDropdowns({ qrExpired: false });
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                                                        !qrExpiredFilter ? "bg-primary-50 text-primary-700" : ""
                                                    }`}
                                                >
                                                    {t('common.all') || "All"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleQrExpiredFilterChange("false");
                                                        setInternalOpenDropdowns({ qrExpired: false });
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                                                        qrExpiredFilter === "false" ? "bg-primary-50 text-primary-700" : ""
                                                    }`}
                                                >
                                                    {t('qrCode.notExpired') || "Not Expired"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleQrExpiredFilterChange("true");
                                                        setInternalOpenDropdowns({ qrExpired: false });
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                                                        qrExpiredFilter === "true" ? "bg-primary-50 text-primary-700" : ""
                                                    }`}
                                                >
                                                    {t('qrCode.expired') || "Expired"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Second Row: Date Range */}
                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                    {/* Date Range Filter */}
                                    <div className="flex items-center gap-2 flex-1 w-full">
                                        <div className="flex items-center gap-2 flex-1">
                                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                                {t('common.dateRange') || "Date Range"}:
                                            </label>
                                            <div className="flex-1">
                                                <FlowbiteDatePicker
                                                    value={qrDateRangeStart}
                                                    onChange={(e) => handleQrDateRangeChange(e.target.value, qrDateRangeEnd)}
                                                    placeholder={t('common.startDate') || "Start Date"}
                                                    maxDate={qrDateRangeEnd || undefined}
                                                    containerClasses=""
                                                />
                                            </div>
                                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                                {t('common.to') || "to"}:
                                            </label>
                                            <div className="flex-1">
                                                <FlowbiteDatePicker
                                                    value={qrDateRangeEnd}
                                                    onChange={(e) => handleQrDateRangeChange(qrDateRangeStart, e.target.value)}
                                                    placeholder={t('common.endDate') || "End Date"}
                                                    minDate={qrDateRangeStart || undefined}
                                                    containerClasses=""
                                                />
                                            </div>
                                            {(qrDateRangeStart || qrDateRangeEnd) && (
                                                <button
                                                    onClick={() => handleQrDateRangeChange("", "")}
                                                    className="px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                                                    title={t('common.clear') || "Clear"}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        {isLoadingQRCodes ? (
                            <div className="p-8 text-center text-gray-500">{t('common.loading') || "Loading..."}</div>
                        ) : (
                            <>
                                <ReusableDataTable
                                    columns={qrColumns}
                                    data={currentQrData}
                                />
                                <div className="border-t border-gray-100">
                                    <ReusablePagination
                                        totalItems={totalQrItems}
                                        itemsPerPage={qrItemsPerPage}
                                        currentPage={qrCurrentPage}
                                        onPageChange={setQrCurrentPage}
                                        totalPages={totalQrPages}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={deleteModalOpen}
                onClose={() => {
                    if (!isDeleting) {
                        setDeleteModalOpen(false);
                        setWorkplaceToDelete(null);
                    }
                }}
                onConfirm={confirmDeleteWorkplace}
                loading={isDeleting}
                title={t('workplace.deleteWorkplace') || "Delete Workplace"}
                message={t('workplace.confirmDelete') || "Are you sure you want to delete this workplace?"}
                icon="warning"
                confirmText={t('common.delete') || "Delete"}
                cancelText={t('common.cancel') || "Cancel"}
                confirmColor="bg-red-600 hover:bg-red-700"
                cancelColor="bg-gray-100 hover:bg-gray-200"
                confirmTextColor="text-white"
                cancelTextColor="text-gray-700"
            />

            {/* QR Code Modal */}
            <WorkplaceQRCodeModal
                isOpen={qrCodeModalOpen}
                onClose={() => {
                    setQrCodeModalOpen(false);
                    setSelectedWorkplaceQrCode(null);
                    setSelectedWorkplaceForQr(null);
                }}
                qrCodeData={selectedWorkplaceQrCode}
                workplaceName={selectedWorkplaceForQr?.name}
            />
        </div>
    );
};

export default WorkplaceManagement;
