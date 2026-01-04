import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Download, Eye, Building2, QrCode, Search, X, ChevronDown } from "lucide-react";
import * as XLSX from 'xlsx';
import DashboardBanner from "../../../components/DashboardBanner";
import ReusableDataTable from "../../../components/ReusableDataTable";
import ReusablePagination from "../../../components/ReusablePagination";
import ReusableFilter from "../../../components/ReusableFilter";
import FlowbiteDatePicker from "../../../components/FlowbiteDatePicker";
import WorkPlaceQrForm from "../manageWorkplaces/features/workPlaceQrForm";
import QrCodeDetail from "../manageWorkplaces/features/QrCodeDetail";
import {
    useGetAllQRCodesQuery,
} from "../../../services/Api";
import { toast } from "react-toastify";
import api from "../../../utils/axios";
import { API_END_POINTS } from "../../../services/ApiEndpoints";

const itemsPerPage = 6;

const ManageQrCode = () => {
    const { t } = useTranslation();
    const [view, setView] = useState("list");
    const [currentPage, setCurrentPage] = useState(1);
    const [qrTab, setQrTab] = useState("All");
    const [selectedQr, setSelectedQr] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [workplaceNameFilter, setWorkplaceNameFilter] = useState("");
    const [companyNameFilter, setCompanyNameFilter] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [expiredFilter, setExpiredFilter] = useState("");
    const [dateRangeStart, setDateRangeStart] = useState("");
    const [dateRangeEnd, setDateRangeEnd] = useState("");
    const [internalOpenDropdowns, setInternalOpenDropdowns] = useState({});
    const [isExporting, setIsExporting] = useState(false);
    const openDropdowns = internalOpenDropdowns;

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

    // Build date_range parameter
    const dateRange = useMemo(() => {
        if (dateRangeStart && dateRangeEnd) {
            return `${dateRangeStart},${dateRangeEnd}`;
        }
        return undefined;
    }, [dateRangeStart, dateRangeEnd]);

    // Fetch QR codes from API
    const { data: qrCodesData, isLoading: isLoadingQRCodes, refetch: refetchQRCodes } = useGetAllQRCodesQuery({
        page: currentPage,
        limit: itemsPerPage,
        status: qrTab === "All" ? undefined : qrTab.toLowerCase(),
        search: searchTerm || undefined,
        workplace_name: workplaceNameFilter || undefined,
        company_name: companyNameFilter || undefined,
        department: departmentFilter || undefined,
        expired: expiredFilter === "" ? undefined : expiredFilter === "true",
        date_range: dateRange,
    });

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

    // Handle tab change
    const handleTabChange = useCallback((tab) => {
        setQrTab(tab);
        setCurrentPage(1);
    }, []);

    // Handle search change
    const handleSearchChange = useCallback((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    // Handle filter changes
    const handleFilterChange = useCallback((key, value) => {
        if (key === "workplace_name") {
            setWorkplaceNameFilter(value);
        } else if (key === "company_name") {
            setCompanyNameFilter(value);
        } else if (key === "department") {
            setDepartmentFilter(value);
        }
        setCurrentPage(1);
    }, []);

    // Handle expired filter change
    const handleExpiredFilterChange = useCallback((value) => {
        setExpiredFilter(value);
        setCurrentPage(1);
    }, []);

    // Handle date range changes
    const handleDateRangeChange = useCallback((start, end) => {
        setDateRangeStart(start);
        setDateRangeEnd(end);
        setCurrentPage(1);
    }, []);

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
            if (searchTerm) {
                params.search = searchTerm;
            }
            if (workplaceNameFilter) {
                params.workplace_name = workplaceNameFilter;
            }
            if (companyNameFilter) {
                params.company_name = companyNameFilter;
            }
            if (departmentFilter) {
                params.department = departmentFilter;
            }
            if (expiredFilter !== "") {
                params.expired = expiredFilter === "true";
            }
            if (dateRange) {
                params.date_range = dateRange;
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
    }, [qrTab, searchTerm, workplaceNameFilter, companyNameFilter, departmentFilter, expiredFilter, dateRange, t, isExporting]);

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

    // QR Pagination from API
    const currentQrData = transformedQRCodes;
    const totalQrItems = qrCodesData?.data?.pagination?.total || 0;
    const totalQrPages = qrCodesData?.data?.pagination?.pages || Math.ceil(totalQrItems / itemsPerPage);

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
            label: t('qrCode.id'),
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
            label: t('map.workplaces'),
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
                    <button onClick={() => handleViewQr(row)} className="text-indigo-500 hover:text-indigo-600">
                        <Eye size={16} strokeWidth={2} />
                    </button>
                    <button className="text-blue-500 hover:text-blue-600">
                        <Download size={16} strokeWidth={2} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
            <div className="space-y-6 max-w-full">
                <DashboardBanner
                    title={t('qrCode.manageTitle')}
                    description={t('qrCode.manageDesc')}
                    rightContent={
                        <button
                            onClick={() => setView("generateQR")}
                            className="bg-[#22B3E8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Plus size={16} /> {t('qrCode.generateTitle')}
                        </button>
                    }
                />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pt-6">
                    <div className="px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                            <h2 className="text-lg font-bold text-[#111827]">{t('qrCode.allQrCodes') || "All QR Codes"}</h2>
                            <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                                {["All", "Active", "Inactive"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
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
                            className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer w-full sm:w-auto justify-center ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="button"
                        >
                            <Download size={16} />
                            {isExporting ? (t('common.loading') || "Exporting...") : t('common.export')}
                        </button>
                    </div>

                    {/* Filter Bar for QR Codes */}
                    <div className="px-4 sm:px-6 pb-4">
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
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSearchTerm(value);
                                                    handleSearchChange(value);
                                                }}
                                                placeholder={t('qrCode.searchPlaceholder') || "Search QR codes..."}
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

                                    {/* Expired Filter Dropdown */}
                                    <div className="relative filter-dropdown w-full md:w-auto md:min-w-[140px]">
                                        <button
                                            onClick={() => {
                                                setInternalOpenDropdowns(prev => ({
                                                    ...prev,
                                                    expired: !prev.expired
                                                }));
                                            }}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors w-full md:w-auto justify-between text-sm ${
                                                expiredFilter
                                                    ? "bg-primary-50 border-primary-200 text-primary-700"
                                                    : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                                            }`}
                                        >
                                            <span className="font-normal">
                                                {expiredFilter === "true"
                                                    ? (t('qrCode.expired') || "Expired")
                                                    : expiredFilter === "false"
                                                    ? (t('qrCode.notExpired') || "Not Expired")
                                                    : (t('qrCode.expiredStatus') || "Expired Status")}
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                                                    openDropdowns?.expired ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openDropdowns?.expired && (
                                            <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-full md:w-auto md:min-w-[180px] left-0">
                                                <button
                                                    onClick={() => {
                                                        handleExpiredFilterChange("");
                                                        setInternalOpenDropdowns({ expired: false });
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                                                        !expiredFilter ? "bg-primary-50 text-primary-700" : ""
                                                    }`}
                                                >
                                                    {t('common.all') || "All"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleExpiredFilterChange("false");
                                                        setInternalOpenDropdowns({ expired: false });
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                                                        expiredFilter === "false" ? "bg-primary-50 text-primary-700" : ""
                                                    }`}
                                                >
                                                    {t('qrCode.notExpired') || "Not Expired"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleExpiredFilterChange("true");
                                                        setInternalOpenDropdowns({ expired: false });
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                                                        expiredFilter === "true" ? "bg-primary-50 text-primary-700" : ""
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
                                    <div className="flex flex-col gap-3 flex-1 w-full">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 w-full">
                                            <div className="flex-1 w-full sm:w-auto">
                                                <FlowbiteDatePicker
                                                    key={`qr-start-${dateRangeEnd}`}
                                                    value={dateRangeStart}
                                                    onChange={(e) => {
                                                        const newStart = e.target.value;
                                                        handleDateRangeChange(newStart, dateRangeEnd);
                                                    }}
                                                    placeholder={t('common.startDate') || "Start Date"}
                                                    maxDate={dateRangeEnd || undefined}
                                                    containerClasses="!mb-0"
                                                />
                                            </div>
                                            <div className="flex-1 w-full sm:w-auto">
                                                <FlowbiteDatePicker
                                                    key={`qr-end-${dateRangeStart}`}
                                                    value={dateRangeEnd}
                                                    onChange={(e) => {
                                                        const newEnd = e.target.value;
                                                        handleDateRangeChange(dateRangeStart, newEnd);
                                                    }}
                                                    placeholder={t('common.endDate') || "End Date"}
                                                    minDate={dateRangeStart || undefined}
                                                    containerClasses="!mb-0"
                                                />
                                            </div>
                                            {(dateRangeStart || dateRangeEnd) && (
                                                <button
                                                    onClick={() => handleDateRangeChange("", "")}
                                                    className="px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors self-start sm:self-center"
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
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={setCurrentPage}
                                        totalPages={totalQrPages}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageQrCode;
