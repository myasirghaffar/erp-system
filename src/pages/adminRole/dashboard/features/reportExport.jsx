import React, { useState, useMemo } from "react";
import FlowbiteDatePicker from "../../../../components/FlowbiteDatePicker";
import Select from "../../../../components/Form/Select";
import MonthYearPicker from "../../../../components/MonthYearPicker";
import ReactSelect from "react-select";
import {
    FullMonthlyExportIcon,
    DateRangeExportIcon,
    EmployeeExportIcon,
    WorkplaceExportIcon,
    CheckIconCyan,
    ExportIconWhite,
    ChevronDownIconLarge,
} from "../../../../assets/icons/icons";
import { useTranslation } from "react-i18next";
import { useGetAllEmployeesQuery } from "../../../../services/Api";
import { useGetAllWorkplacesQuery } from "../../../../services/Api";
import { API_END_POINTS } from "../../../../services/ApiEndpoints";
import api from "../../../../utils/axios";
import { toast } from "react-toastify";

const ExportCard = ({
    title,
    description,
    icon: Icon,
    iconBgColor,
    children,
    className = "",
}) => {
    return (
        <div
            className={`relative bg-white rounded-[10.27px] shadow-[0px_0.85546875px_1.7109375px_0px_rgba(0,0,0,0.05)] outline outline-[0.86px] outline-offset-[-0.86px] outline-gray-200 p-6 ${className}`}
        >
            <div className="flex items-start gap-6 mb-6">
                <div
                    className={`size-10 flex-shrink-0 flex items-center justify-center rounded-md ${iconBgColor}`}
                >
                    <Icon className="w-3 h-6" />
                </div>
                <div>
                    <div className="text-gray-900 text-xl font-semibold font-inter leading-7">
                        {title}
                    </div>
                    <div className="text-gray-600 text-sm font-normal font-inter leading-5 mt-1">
                        {description}
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
};

const ExportButton = ({ text, className = "", onClick, disabled = false, isLoading = false }) => (
    <button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={`h-11 bg-sky-400 rounded-md flex items-center justify-center gap-3 px-6 hover:bg-sky-500 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        <ExportIconWhite className="w-4 h-4" />
        <span className="text-white text-sm font-medium font-inter">
            {isLoading ? "Exporting..." : text}
        </span>
    </button>
);

const CustomLabel = ({ label }) => (
    <label className="block text-gray-700 text-xs font-medium font-inter mb-1">
        {label}
    </label>
);

const ReportExport = () => {
    const { t } = useTranslation();
    
    // State for filters
    const [selectedMonth, setSelectedMonth] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedWorkplace, setSelectedWorkplace] = useState("");
    const [employeeMonth, setEmployeeMonth] = useState("");
    const [workplaceMonth, setWorkplaceMonth] = useState("");
    const [exportFormat, setExportFormat] = useState("Excel (.xlsx)");
    
    // Loading states
    const [isExportingMonthly, setIsExportingMonthly] = useState(false);
    const [isExportingRange, setIsExportingRange] = useState(false);
    const [isExportingEmployee, setIsExportingEmployee] = useState(false);
    const [isExportingWorkplace, setIsExportingWorkplace] = useState(false);
    
    // Fetch employees and workplaces
    // Note: Backend validation limits max limit to 100
    const { data: employeesData } = useGetAllEmployeesQuery({ page: 1, limit: 100 });
    const { data: workplacesData } = useGetAllWorkplacesQuery({ page: 1, limit: 100 });
    
    // Initialize default month (current month)
    React.useEffect(() => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
        const defaultMonth = `${currentYear}-${currentMonth}`;
        
        if (!selectedMonth) {
            setSelectedMonth(defaultMonth);
        }
        if (!employeeMonth) {
            setEmployeeMonth(defaultMonth);
        }
        if (!workplaceMonth) {
            setWorkplaceMonth(defaultMonth);
        }
    }, [selectedMonth, employeeMonth, workplaceMonth]);
    
    // Initialize default dates
    React.useEffect(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        if (!startDate) {
            setStartDate(firstDay.toISOString().split('T')[0]);
        }
        if (!endDate) {
            setEndDate(lastDay.toISOString().split('T')[0]);
        }
    }, [startDate, endDate]);
    
    // Transform employees data for dropdown
    const employeeOptions = useMemo(() => {
        if (!employeesData?.data?.employees) return [];
        return employeesData.data.employees.map(emp => ({
            value: emp.id.toString(),
            label: emp.full_name || `${emp.email || `Employee ${emp.id}`}`
        }));
    }, [employeesData]);
    
    // Transform workplaces data for dropdown
    const workplaceOptions = useMemo(() => {
        if (!workplacesData?.data?.workplaces) return [];
        return workplacesData.data.workplaces.map(wp => ({
            value: wp.id.toString(),
            label: wp.name || `Workplace ${wp.id}`
        }));
    }, [workplacesData]);
    
    // Download file helper
    const downloadFile = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };
    
    // Export Monthly Attendance
    const handleExportMonthly = async () => {
        if (!selectedMonth) {
            toast.error(t('report.selectMonth') || "Please select a month");
            return;
        }
        
        setIsExportingMonthly(true);
        try {
            const response = await api.get(API_END_POINTS.exportMonthlyAttendance, {
                params: { month: selectedMonth },
                responseType: 'blob'
            });
            
            downloadFile(response.data, `monthly_attendance_${selectedMonth.replace('-', '_')}.xlsx`);
            toast.success(t('report.exportSuccess') || "Export successful!");
        } catch (error) {
            console.error('Export error:', error);
            toast.error(error.response?.data?.message || t('report.exportError') || "Export failed");
        } finally {
            setIsExportingMonthly(false);
        }
    };
    
    // Export Date Range
    const handleExportRange = async () => {
        if (!startDate || !endDate) {
            toast.error(t('report.selectDateRange') || "Please select start and end dates");
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            toast.error(t('report.invalidDateRange') || "Start date must be before end date");
            return;
        }
        
        setIsExportingRange(true);
        try {
            const response = await api.get(API_END_POINTS.exportDateRangeAttendance, {
                params: { 
                    start_date: startDate,
                    end_date: endDate
                },
                responseType: 'blob'
            });
            
            downloadFile(response.data, `attendance_range_${startDate}_to_${endDate}.xlsx`);
            toast.success(t('report.exportSuccess') || "Export successful!");
        } catch (error) {
            console.error('Export error:', error);
            toast.error(error.response?.data?.message || t('report.exportError') || "Export failed");
        } finally {
            setIsExportingRange(false);
        }
    };
    
    // Export Employee Attendance
    const handleExportEmployee = async () => {
        if (!selectedEmployee) {
            toast.error(t('report.selectEmployee') || "Please select an employee");
            return;
        }
        if (!employeeMonth) {
            toast.error(t('report.selectMonth') || "Please select a month");
            return;
        }
        
        setIsExportingEmployee(true);
        try {
            const response = await api.get(API_END_POINTS.exportEmployeeAttendance, {
                params: { 
                    user_id: selectedEmployee,
                    month: employeeMonth
                },
                responseType: 'blob'
            });
            
            const employeeName = employeeOptions.find(e => e.value === selectedEmployee)?.label || 'employee';
            downloadFile(response.data, `employee_attendance_${employeeName.replace(/\s+/g, '_')}_${employeeMonth.replace('-', '_')}.xlsx`);
            toast.success(t('report.exportSuccess') || "Export successful!");
        } catch (error) {
            console.error('Export error:', error);
            toast.error(error.response?.data?.message || t('report.exportError') || "Export failed");
        } finally {
            setIsExportingEmployee(false);
        }
    };
    
    // Export Workplace Attendance
    const handleExportWorkplace = async () => {
        if (!selectedWorkplace) {
            toast.error(t('workplace.selectWorkplaceTitle') || "Please select a workplace");
            return;
        }
        if (!workplaceMonth) {
            toast.error(t('report.selectMonth') || "Please select a month");
            return;
        }
        
        setIsExportingWorkplace(true);
        try {
            const response = await api.get(API_END_POINTS.exportWorkplaceAttendance, {
                params: { 
                    workplace_id: selectedWorkplace,
                    month: workplaceMonth
                },
                responseType: 'blob'
            });
            
            const workplaceName = workplaceOptions.find(w => w.value === selectedWorkplace)?.label || 'workplace';
            downloadFile(response.data, `workplace_attendance_${workplaceName.replace(/\s+/g, '_')}_${workplaceMonth.replace('-', '_')}.xlsx`);
            toast.success(t('report.exportSuccess') || "Export successful!");
        } catch (error) {
            console.error('Export error:', error);
            toast.error(error.response?.data?.message || t('report.exportError') || "Export failed");
        } finally {
            setIsExportingWorkplace(false);
        }
    };

    return (
        <div className="w-full relative bg-transparent space-y-6">
            {/* Full Monthly Export */}
            <ExportCard
                title={t('report.fullMonthlyExport')}
                description={t('report.fullMonthlyExportDesc')}
                icon={FullMonthlyExportIcon}
                iconBgColor="bg-green-50"
                className="w-full"
            >
                <div className="flex flex-col lg:flex-row items-end gap-6 mb-6">
                    <div className="w-full lg:w-72">
                        <MonthYearPicker
                            label={t('report.selectMonth')}
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            placeholder={t('report.selectMonth') || "Select month and year"}
                            minYear={2024}
                            maxYear={2035}
                        />
                    </div>
                    <ExportButton
                        text={t('report.exportMonthlyExcel')}
                        className="w-full lg:w-auto"
                        onClick={handleExportMonthly}
                        isLoading={isExportingMonthly}
                    />
                </div>

                <div className="w-full bg-gray-50 rounded-md border border-gray-200 p-4">
                    <h4 className="text-gray-900 text-sm font-medium font-inter mb-4">
                        {t('report.exportIncludes')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                        {[
                            t('table.name'),
                            t('workplace.workplaceName'),
                            t('report.checkInOut'),
                            t('report.totalHours'),
                            t('report.locationVerification'),
                            t('report.manualEntryNotes'),
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <CheckIconCyan className="w-2.5 h-3 flex-shrink-0" />
                                <span className="text-gray-600 text-xs font-normal font-inter">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </ExportCard>

            {/* Date-Range Export */}
            <ExportCard
                title={t('report.dateRangeExport')}
                description={t('report.dateRangeExportDesc')}
                icon={DateRangeExportIcon}
                iconBgColor="bg-blue-100"
                className="w-full"
            >
                <div className="flex flex-col lg:flex-row items-end gap-6">
                    <div className="w-full lg:w-60">
                        <FlowbiteDatePicker
                            label={t('report.startDate')}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder={t('report.startDate') || "Select start date"}
                            maxDate={endDate || undefined}
                            className="h-11"
                        />
                    </div>
                    <div className="w-full lg:w-60">
                        <FlowbiteDatePicker
                            label={t('report.endDate')}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder={t('report.endDate') || "Select end date"}
                            minDate={startDate || undefined}
                            className="h-11"
                        />
                    </div>
                    <div className="w-full lg:w-60">
                        <CustomLabel label={t('report.exportFormat')} />
                        <div className="relative">
                            <Select
                                options={[{ value: "Excel (.xlsx)", label: "Excel (.xlsx)" }]}
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className="w-full h-11 bg-white text-black text-sm font-normal font-inter border border-gray-300 appearance-none pr-10"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDownIconLarge />
                            </div>
                        </div>
                    </div>
                    <ExportButton 
                        text={t('report.exportRange')} 
                        className="w-full lg:w-60"
                        onClick={handleExportRange}
                        isLoading={isExportingRange}
                    />
                </div>
            </ExportCard>

            {/* Bottom Section: Employee & Workplace Export */}
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Employee Attendance Export */}
                <ExportCard
                    title={t('report.employeeExport')}
                    description={t('report.employeeExportDesc')}
                    icon={EmployeeExportIcon}
                    iconBgColor="bg-purple-100"
                    className="flex-1"
                >
                    <div className="space-y-6">
                        <div>
                            <CustomLabel label={t('report.selectEmployee')} />
                            <ReactSelect
                                options={employeeOptions}
                                value={employeeOptions.find(opt => opt.value === selectedEmployee) || null}
                                onChange={(selected) => setSelectedEmployee(selected?.value || "")}
                                placeholder={t('report.selectEmployee') || "Select Employee"}
                                isSearchable={true}
                                isClearable={true}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        minHeight: '44px',
                                        height: '44px',
                                        backgroundColor: 'white',
                                        borderColor: state.isFocused ? '#0ea5e9' : '#d1d5db',
                                        borderRadius: '0.375rem',
                                        boxShadow: state.isFocused ? '0 0 0 1px #0ea5e9' : 'none',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#0ea5e9' : '#9ca3af',
                                        },
                                    }),
                                    valueContainer: (base) => ({
                                        ...base,
                                        height: '44px',
                                        padding: '0 8px',
                                    }),
                                    input: (base) => ({
                                        ...base,
                                        margin: '0',
                                        padding: '0',
                                        color: '#000',
                                        fontSize: '14px',
                                        fontFamily: 'Inter, sans-serif',
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        fontFamily: 'Inter, sans-serif',
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: '#000',
                                        fontSize: '14px',
                                        fontFamily: 'Inter, sans-serif',
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        borderRadius: '0.375rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected
                                            ? '#0ea5e9'
                                            : state.isFocused
                                                ? '#e0f2fe'
                                                : 'white',
                                        color: state.isSelected ? 'white' : '#000',
                                        fontSize: '14px',
                                        fontFamily: 'Inter, sans-serif',
                                        padding: '10px 12px',
                                        '&:active': {
                                            backgroundColor: state.isSelected ? '#0ea5e9' : '#bae6fd',
                                        },
                                    }),
                                    indicatorSeparator: () => ({
                                        display: 'none',
                                    }),
                                    dropdownIndicator: (base) => ({
                                        ...base,
                                        color: '#6b7280',
                                        padding: '8px',
                                        '&:hover': {
                                            color: '#374151',
                                        },
                                    }),
                                }}
                            />
                        </div>
                        <div>
                            <MonthYearPicker
                                label={t('report.month')}
                                value={employeeMonth}
                                onChange={(e) => setEmployeeMonth(e.target.value)}
                                placeholder={t('report.month') || "Select month and year"}
                                minYear={2024}
                                maxYear={2035}
                            />
                        </div>
                        <ExportButton 
                            text={t('report.exportEmployeeAttendance')} 
                            className="w-full"
                            onClick={handleExportEmployee}
                            isLoading={isExportingEmployee}
                        />
                    </div>
                </ExportCard>

                {/* Workplace Attendance Export */}
                <ExportCard
                    title={t('report.workplaceExport')}
                    description={t('report.workplaceExportDesc')}
                    icon={WorkplaceExportIcon}
                    iconBgColor="bg-orange-100"
                    className="flex-1"
                >
                    <div className="space-y-6">
                        <div>
                            <CustomLabel label={t('workplace.selectWorkplaceTitle')} />
                            <ReactSelect
                                options={workplaceOptions}
                                value={workplaceOptions.find(opt => opt.value === selectedWorkplace) || null}
                                onChange={(selected) => setSelectedWorkplace(selected?.value || "")}
                                placeholder={t('workplace.selectWorkplaceTitle') || "Select Workplace"}
                                isSearchable={true}
                                isClearable={true}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        minHeight: '44px',
                                        height: '44px',
                                        backgroundColor: 'white',
                                        borderColor: state.isFocused ? '#0ea5e9' : '#d1d5db',
                                        borderRadius: '0.375rem',
                                        boxShadow: state.isFocused ? '0 0 0 1px #0ea5e9' : 'none',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#0ea5e9' : '#9ca3af',
                                        },
                                    }),
                                    valueContainer: (base) => ({
                                        ...base,
                                        height: '44px',
                                        padding: '0 8px',
                                    }),
                                    input: (base) => ({
                                        ...base,
                                        margin: '0',
                                        padding: '0',
                                        color: '#000',
                                        fontSize: '14px',
                                        fontFamily: 'Inter, sans-serif',
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: '#6b7280',
                                        fontSize: '14px',
                                        fontFamily: 'Inter, sans-serif',
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: '#000',
                                        fontSize: '14px',
                                        fontFamily: 'Inter, sans-serif',
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        borderRadius: '0.375rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected
                                            ? '#0ea5e9'
                                            : state.isFocused
                                                ? '#e0f2fe'
                                                : 'white',
                                        color: state.isSelected ? 'white' : '#000',
                                        fontSize: '14px',
                                        fontFamily: 'Inter, sans-serif',
                                        padding: '10px 12px',
                                        '&:active': {
                                            backgroundColor: state.isSelected ? '#0ea5e9' : '#bae6fd',
                                        },
                                    }),
                                    indicatorSeparator: () => ({
                                        display: 'none',
                                    }),
                                    dropdownIndicator: (base) => ({
                                        ...base,
                                        color: '#6b7280',
                                        padding: '8px',
                                        '&:hover': {
                                            color: '#374151',
                                        },
                                    }),
                                }}
                            />
                        </div>
                        <div>
                            <MonthYearPicker
                                label={t('report.month')}
                                value={workplaceMonth}
                                onChange={(e) => setWorkplaceMonth(e.target.value)}
                                placeholder={t('report.month') || "Select month and year"}
                                minYear={2024}
                                maxYear={2035}
                            />
                        </div>
                        <ExportButton 
                            text={t('report.exportWorkplaceAttendance')} 
                            className="w-full"
                            onClick={handleExportWorkplace}
                            isLoading={isExportingWorkplace}
                        />
                    </div>
                </ExportCard>
            </div>
        </div>
    );
};

export default ReportExport;
