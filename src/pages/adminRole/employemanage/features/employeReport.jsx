import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ReusableDataTable from "../../../../components/ReusableDataTable";
import ReusableFilter from "../../../../components/ReusableFilter";
import ReusablePagination from "../../../../components/ReusablePagination";
import ConfirmModal from "../../../../components/ConfirmModal";
import {
    Search,
    Download,
    CheckSquare,
    Eye,
    Edit3,
    Trash2
} from "lucide-react";
import {
    useGetAllEmployeesQuery,
    useDeleteEmployeeMutation,
    useUpdateEmployeeStatusMutation,
    useChangeEmployeeRoleMutation,
} from "../../../../services/Api";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";
import * as XLSX from 'xlsx';
import api from "../../../../utils/axios";
import { API_END_POINTS } from "../../../../services/ApiEndpoints";

const itemsPerPage = 5;

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

// Demo Data expanded for pagination (fallback)
const demoData = [
    {
        id: 1,
        name: "John Smith",
        title: "Senior Developer",
        email: "john.smith@company.com",
        phone: "+1 (555) 234-5678",
        status: "Active",
        avatar: "JS"
    },
    {
        id: 2,
        name: "Emily Davis",
        title: "Marketing Manager",
        email: "emily.davis@company.com",
        phone: "+1 (555) 234-5678",
        status: "Active",
        avatar: "ED"
    },
    {
        id: 3,
        name: "Michael Johnson",
        title: "Sales Representative",
        email: "michael.johnson@company.com",
        phone: "+1 (555) 345-6789",
        status: "Inactive",
        avatar: "MJ"
    },
    // ... (Data truncated for brevity, would be full list in real implementation, but for this tool I only need the component structure fixed. I'll include a few items to avoid empty table)
    {
        id: 4,
        name: "Sarah Wilson",
        title: "UX Designer",
        email: "sarah.wilson@company.com",
        phone: "+1 (555) 456-7890",
        status: "Active",
        avatar: "SW"
    },
    { id: 5, name: "David Brown", title: "Financial Analyst", email: "david.brown@company.com", phone: "+1 (555) 567-8901", status: "Active", avatar: "DB" },
    { id: 6, name: "James Wilson", title: "Product Manager", email: "james.wilson@company.com", phone: "+1 (555) 678-9012", status: "Active", avatar: "JW" }
    // ...
];

const EmployeeReport = ({ onViewProfile, onEdit }) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        role: "",
        status: "",
        search: "",
    });
    const [searchInput, setSearchInput] = useState("");
    const searchTimeoutRef = useRef(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    // Convert status from UI format (Active/Inactive) to backend format (active/inactive)
    const getBackendStatus = (status) => {
        if (!status) return undefined;
        return status === "Active" ? "active" : status === "Inactive" ? "inactive" : status;
    };

    // Convert role filter to backend format
    const getBackendRole = (role) => {
        if (!role) return undefined;
        if (role === "not_assigned") return "null"; // Backend expects "null" string for users without roles
        return role;
    };

    // Fetch employees from API
    const { data: employeesData, isLoading, error, refetch } = useGetAllEmployeesQuery({
        page: currentPage,
        limit: itemsPerPage,
        status: getBackendStatus(filters.status) || undefined,
        role: getBackendRole(filters.role) || undefined,
        search: filters.search || undefined,
    });

    // Mutations
    const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
    const [updateEmployeeStatus, { isLoading: isUpdatingStatus }] = useUpdateEmployeeStatusMutation();
    const [changeEmployeeRole, { isLoading: isChangingRole }] = useChangeEmployeeRoleMutation();
    
    // State for role assignment
    const [roleAssignmentModal, setRoleAssignmentModal] = useState({ open: false, employee: null });

    // Transform API data to match component format
    const transformedData = useMemo(() => {
        if (!employeesData?.data?.employees) return demoData;
        
        return employeesData.data.employees.map((employee) => {
            const nameParts = employee.full_name?.split(" ") || ["Unknown"];
            const initials = nameParts.length >= 2 
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                : nameParts[0]?.[0]?.toUpperCase() || "U";
            
            const employeeName = employee.full_name || "Unknown";
            const avatarColor = getAvatarColor(employeeName);
            
            return {
                id: employee.id,
                name: employeeName,
                title: employee.position || employee.role || "Not Assigned",
                email: employee.email || "",
                phone: employee.phone_number || employee.phone || "",
                status: employee.status === "active" ? "Active" : "Inactive",
                role: employee.role || null, // Store role for role assignment check
                avatar: initials,
                avatarColor: avatarColor,
                employeeData: employee, // Store full employee data for actions
            };
        });
    }, [employeesData]);

    // Handle search input change with debouncing
    const handleSearchChange = useCallback((value) => {
        setSearchInput(value);
        
        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        // Set new timeout for debouncing
        searchTimeoutRef.current = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: value }));
            setCurrentPage(1); // Reset to first page on search
        }, 500); // 500ms debounce
    }, []);

    // Handle filter change from dropdowns
    const handleFilterChange = useCallback((filterKey, value) => {
        setFilters(prev => ({ ...prev, [filterKey]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    }, []);

    // Reset all filters
    const handleResetFilters = useCallback(() => {
        setFilters({
            role: "",
            status: "",
            search: "",
        });
        setSearchInput("");
        setCurrentPage(1);
        setFilterResetKey(prev => prev + 1); // Force filter components to remount
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Handle delete employee - open confirmation modal
    const handleDeleteClick = useCallback((employeeId) => {
        setEmployeeToDelete(employeeId);
        setDeleteModalOpen(true);
    }, []);

    // Handle confirmed delete
    const handleConfirmDelete = useCallback(async () => {
        if (!employeeToDelete) return;
        
        try {
            await deleteEmployee(employeeToDelete).unwrap();
            toast.success(t('employee.employeeDeletedSuccess'));
            refetch();
            setDeleteModalOpen(false);
            setEmployeeToDelete(null);
        } catch (error) {
            toast.error(error?.data?.message || t('employee.deleteEmployeeError'));
        }
    }, [deleteEmployee, employeeToDelete, refetch]);

    // Handle cancel delete
    const handleCancelDelete = useCallback(() => {
        setDeleteModalOpen(false);
        setEmployeeToDelete(null);
    }, []);

    // Handle status update
    const handleStatusUpdate = useCallback(async (employeeId, newStatus) => {
        try {
            await updateEmployeeStatus({
                id: employeeId,
                data: { status: newStatus === "Active" ? "active" : "inactive" }
            }).unwrap();
            toast.success(t('employee.statusUpdatedSuccess'));
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || t('employee.statusUpdateError'));
        }
    }, [updateEmployeeStatus, refetch, t]);

    // Handle role assignment
    const handleAssignRole = useCallback((employee) => {
        setRoleAssignmentModal({ open: true, employee });
    }, []);

    // Handle role assignment confirmation
    const handleConfirmRoleAssignment = useCallback(async (role) => {
        if (!roleAssignmentModal.employee) return;
        
        try {
            await changeEmployeeRole({
                id: roleAssignmentModal.employee.id,
                data: { role }
            }).unwrap();
            toast.success(t('employee.roleAssignedSuccess') || 'Role assigned successfully');
            setRoleAssignmentModal({ open: false, employee: null });
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || t('employee.roleAssignmentError') || 'Failed to assign role');
        }
    }, [changeEmployeeRole, roleAssignmentModal, refetch, t]);

    // Handle cancel role assignment
    const handleCancelRoleAssignment = useCallback(() => {
        setRoleAssignmentModal({ open: false, employee: null });
    }, []);

    // Export all employees to Excel
    const handleExportEmployees = useCallback(async () => {
        if (isExporting) return; // Prevent multiple clicks
        
        setIsExporting(true);
        try {
            if (!XLSX || !XLSX.utils) {
                toast.error('Excel library not loaded. Please refresh the page.');
                setIsExporting(false);
                return;
            }

            // Helper function to fetch all pages of employees
            const fetchAllEmployees = async (baseParams) => {
                const allEmployees = [];
                let currentPage = 1;
                const limit = 100; // Max allowed by backend
                let hasMore = true;

                while (hasMore) {
                    const params = {
                        ...baseParams,
                        page: currentPage,
                        limit: limit,
                    };

                    const response = await api.get(API_END_POINTS.getAllEmployees, { params });
                    const pageEmployees = response.data?.data?.employees || [];
                    const pagination = response.data?.data?.pagination || {};
                    
                    allEmployees.push(...pageEmployees);

                    // Check if there are more pages
                    const totalPages = pagination.pages || Math.ceil((pagination.total || 0) / limit);
                    hasMore = currentPage < totalPages && pageEmployees.length > 0;
                    currentPage++;
                }

                return allEmployees;
            };

            // Fetch ALL employees regardless of filters
            // We need to fetch both assigned and unassigned users separately
            const baseParams = {
                limit: 100, // Max allowed limit
            };

            // Fetch assigned users (default behavior - excludes pending)
            const assignedEmployees = await fetchAllEmployees(baseParams);
            
            // Also fetch unassigned/pending users
            const unassignedEmployees = await fetchAllEmployees({
                ...baseParams,
                role: "null",
            });

            // Combine all employees
            const employees = [...assignedEmployees, ...unassignedEmployees];
            
            if (employees.length === 0) {
                toast.warning(t('employee.noDataToExport') || "No employees found to export");
                setIsExporting(false);
                return;
            }

            // Transform data for Excel
            const excelData = employees.map((employee, index) => ({
                'No.': index + 1,
                'ID': employee.id,
                'Full Name': employee.full_name || '-',
                'Email': employee.email || '-',
                'Phone Number': employee.phone_number || '-',
                'Position': employee.position || '-',
                'Role': employee.role || 'Not Assigned',
                'Status': employee.status === 'active' ? 'Active' : 'Inactive',
                'Pending Leave Requests': employee.pending_leave_requests || 0,
                'Created At': employee.created_at ? new Date(employee.created_at).toLocaleString() : '-',
                'Last Login': employee.last_login ? new Date(employee.last_login).toLocaleString() : '-',
            }));

            // Create workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(excelData);

            // Set column widths
            const columnWidths = [
                { wch: 5 },  // No.
                { wch: 10 }, // ID
                { wch: 25 }, // Full Name
                { wch: 30 }, // Email
                { wch: 18 }, // Phone Number
                { wch: 20 }, // Position
                { wch: 15 }, // Role
                { wch: 12 }, // Status
                { wch: 20 }, // Pending Leave Requests
                { wch: 20 }, // Created At
                { wch: 20 }, // Last Login
            ];
            worksheet['!cols'] = columnWidths;

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

            // Generate filename with current date
            const dateStr = new Date().toISOString().split('T')[0];
            const filename = `Employees_Export_${dateStr}.xlsx`;

            // Write file and trigger download
            XLSX.writeFile(workbook, filename);
            
            toast.success('Employees exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error(error?.response?.data?.message || t('employee.exportError') || 'Failed to export employees');
        } finally {
            setIsExporting(false);
        }
    }, [isExporting, filters, t]);

    // Calculate pagination from API
    const currentTableData = transformedData;
    const totalItems = employeesData?.data?.pagination?.total || transformedData.length;
    const totalPages = employeesData?.data?.pagination?.pages || employeesData?.data?.pagination?.totalPages || Math.ceil(totalItems / itemsPerPage);

    const filterConfig = [
        {
            key: "role",
            label: t('employee.allRoles'),
            options: [
                { label: t('employee.allRoles'), value: "" },
                { label: t('employee.notAssigned') || "Not Assigned", value: "not_assigned" },
                { label: t('employee.roleEmployee'), value: "employee" },
                { label: t('employee.roleManager'), value: "manager" },
                { label: t('employee.roleAdmin'), value: "admin" }
            ]
        },
        {
            key: "status",
            label: t('employee.allStatus'),
            options: [
                { label: t('employee.allStatus'), value: "" },
                { label: t('employee.active'), value: "Active" },
                { label: t('employee.inactive'), value: "Inactive" }
            ]
        }
    ];

    const columns = [
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
            label: t('table.name'),
            minWidth: "18.75rem", // 300px
            grow: 1,
            render: (row) => {
                const avatarColor = row.avatarColor || getAvatarColor(row.name);
                return (
                    <div className="flex items-center gap-3 py-3">
                        <div className={`w-10 h-10 rounded-full ${avatarColor.bg} ${avatarColor.text} flex items-center justify-center text-sm font-bold shrink-0 shadow-sm`}>
                            {row.avatar}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#111827] font-bold text-[0.875rem] leading-tight">{row.name}</span>
                            <span className="text-gray-400 text-[0.75rem] font-medium mt-0.5">{row.title}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            key: "email",
            label: t('table.email'),
            minWidth: "12.5rem", // 200px
            grow: 1,
            render: (row) => (
                <span className="text-[#374151] font-medium text-[0.8125rem]">{row.email}</span>
            )
        },
        {
            key: "phone",
            label: t('table.phone'),
            minWidth: "10rem", // 160px
            render: (row) => (
                <span className="text-[#374151] font-medium text-[0.8125rem]">{row.phone}</span>
            )
        },
        {
            key: "status",
            label: t('table.status'),
            minWidth: "7.5rem", // 120px
            render: (row) => (
                <div
                    className={`px-3.5 py-1 rounded-full text-[0.6875rem] font-bold inline-flex items-center justify-center transition-colors ${row.status === "Active"
                        ? "bg-green-50 text-green-500"
                        : "bg-red-50 text-red-500"
                        }`}
                >
                    {row.status === "Active" ? t('employee.active') : t('employee.inactive')}
                </div>
            )
        },
        {
            key: "actions",
            label: t('table.actions'),
            width: "12.5rem", // 200px
            render: (row) => (
                <div className="flex items-center gap-5">
                    {/* Role Assignment Button - Show only if role is not assigned */}
                    {!row.role && (
                        <button 
                            onClick={() => handleAssignRole(row.employeeData)} 
                            className="text-green-500 hover:text-green-600 transition-colors"
                            disabled={isChangingRole}
                            title={t('employee.assignRoleTooltip') || 'Assign Role'}
                        >
                            <UserPlus size={18} strokeWidth={2} />
                        </button>
                    )}
                    <button 
                        onClick={() => handleStatusUpdate(row.id, row.status === "Active" ? "Inactive" : "Active")}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                        disabled={isUpdatingStatus}
                        title={t('employee.toggleStatusTooltip')}
                    >
                        <CheckSquare size={18} strokeWidth={2} />
                    </button>
                    <button 
                        onClick={() => onViewProfile && onViewProfile(row.employeeData)} 
                        className="text-indigo-500 hover:text-indigo-600 transition-colors"
                        title={t('employee.viewProfileTooltip')}
                    >
                        <Eye size={18} strokeWidth={2} />
                    </button>
                    <button 
                        onClick={() => onEdit && onEdit(row.employeeData)} 
                        className="text-amber-500 hover:text-amber-600 transition-colors"
                        title={t('employee.editEmployeeTooltip')}
                    >
                        <Edit3 size={18} strokeWidth={2} />
                    </button>
                    <button 
                        onClick={() => handleDeleteClick(row.id)} 
                        className="text-red-500 hover:text-red-600 transition-colors"
                        disabled={isDeleting}
                        title={t('employee.deleteEmployeeTooltip')}
                    >
                        <Trash2 size={18} strokeWidth={2} />
                    </button>
                </div>
            )
        }
    ];

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [filterResetKey, setFilterResetKey] = useState(0);

    const handleToggleDropdown = (key) => {
        setActiveDropdown(prev => prev === key ? null : key);
    };

    return (
        <div className="w-full space-y-6" onClick={(e) => {
            if (!e.target.closest(".filter-dropdown")) {
                setActiveDropdown(null);
            }
        }}>
            {/* Search & Filter Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-7">
                    <h2 className="text-[#111827] text-[16px] font-bold font-inter tracking-tight">{t('employee.searchAndFilterTitle')}</h2>
                    <button 
                        onClick={handleResetFilters}
                        className="text-sky-500 text-[13px] font-semibold hover:text-sky-600 transition-colors"
                    >
                        {t('employee.resetFilters')}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Search Field */}
                    <div className="space-y-2">
                        <label className="text-gray-500 text-[13px] font-semibold block">{t('employee.searchLabel')}</label>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder={t('employee.searchPlaceholder')}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] font-inter focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                    </div>

                    {/* Filter Dropdowns */}
                    {filterConfig.map((filter) => (
                        <div key={`${filter.key}-${filterResetKey}`} className="space-y-2 text-left filter-dropdown">
                            <label className="text-gray-500 text-[13px] font-semibold block">{filter.key.charAt(0).toUpperCase() + filter.key.slice(1)}</label>
                            <ReusableFilter
                                key={`${filter.key}-filter-${filterResetKey}`}
                                filters={[filter]}
                                data={transformedData}
                                onFilterChange={(filterKey, value) => handleFilterChange(filterKey, value)}
                                className="w-full"
                                filterClassName="w-full"
                                dropdownClassName="min-w-full"
                                externalOpenDropdowns={{ [filter.key]: activeDropdown === filter.key }}
                                onToggleDropdown={handleToggleDropdown}
                                fullWidth={true}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 pb-6 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-[#111827] text-[18px] font-bold font-inter">{t('employee.employeeDirectory')}</h2>
                        <p className="text-gray-400 text-[13px] font-medium mt-0.5">{t('employee.employeeCount', { count: totalItems })}</p>
                    </div>
                    <button 
                        onClick={handleExportEmployees}
                        disabled={isExporting}
                        className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t('employee.exportEmployees') || 'Export all employees to Excel'}
                    >
                        <Download size={18} strokeWidth={2} />
                    </button>
                </div>

                <div className="w-full">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">{t('employee.loadingEmployees')}</div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">{t('employee.errorLoadingEmployees')}</div>
                    ) : (
                        <ReusableDataTable
                            columns={columns}
                            data={currentTableData}
                        />
                    )}
                </div>

                {/* Pagination Footer */}
                <ReusablePagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    totalPages={totalPages}
                />
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={deleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                title={t('employee.deleteEmployeeTitle')}
                message={t('employee.deleteEmployeeMessage')}
                icon="warning"
                confirmText={t('employee.confirmDelete')}
                cancelText={t('employee.cancel')}
                confirmColor="bg-red-600 hover:bg-red-700"
            />

            {/* Role Assignment Modal */}
            {roleAssignmentModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {t('employee.assignRoleTitle') || 'Assign Role'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-6">
                            {t('employee.assignRoleMessage', { name: roleAssignmentModal.employee?.full_name || 'this user' }) || `Assign a role to ${roleAssignmentModal.employee?.full_name || 'this user'}`}
                        </p>
                        
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={() => handleConfirmRoleAssignment('employee')}
                                disabled={isChangingRole}
                                className="w-full text-left px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all disabled:opacity-50"
                            >
                                <div className="font-semibold text-gray-900">{t('employee.roleEmployee')}</div>
                                <div className="text-sm text-gray-500">{t('employee.roleEmployeeDesc') || 'Basic employee access'}</div>
                            </button>
                            <button
                                onClick={() => handleConfirmRoleAssignment('manager')}
                                disabled={isChangingRole}
                                className="w-full text-left px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all disabled:opacity-50"
                            >
                                <div className="font-semibold text-gray-900">{t('employee.roleManager')}</div>
                                <div className="text-sm text-gray-500">{t('employee.roleManagerDesc') || 'Team management access'}</div>
                            </button>
                            <button
                                onClick={() => handleConfirmRoleAssignment('admin')}
                                disabled={isChangingRole}
                                className="w-full text-left px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                            >
                                <div className="font-semibold text-gray-900">{t('employee.roleAdmin')}</div>
                                <div className="text-sm text-gray-500">{t('employee.roleAdminDesc') || 'Full system access'}</div>
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelRoleAssignment}
                                disabled={isChangingRole}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {t('employee.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeReport;
