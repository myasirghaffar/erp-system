import React, { useRef } from "react";
import ReusableInput from "../../../../components/ReusableInput";
import Select from "../../../../components/Form/Select";
import {
    FullMonthlyExportIcon,
    DateRangeExportIcon,
    EmployeeExportIcon,
    WorkplaceExportIcon,
    CheckIconCyan,
    ExportIconWhite,
    ChevronDownIconLarge,
    CalendarIconLarge,
} from "../../../../assets/icons/icons";
import { useTranslation } from "react-i18next";

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

const ExportButton = ({ text, className = "" }) => (
    <button
        className={`h-11 bg-sky-400 rounded-md flex items-center justify-center gap-3 px-6 hover:bg-sky-500 transition-colors whitespace-nowrap ${className}`}
    >
        <ExportIconWhite className="w-4 h-4" />
        <span className="text-white text-sm font-medium font-inter">
            {text}
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
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const [startDate, setStartDate] = React.useState("2024-12-01");
    const [endDate, setEndDate] = React.useState("2024-12-31");

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
                        <CustomLabel label={t('report.selectMonth')} />
                        <div className="relative">
                            <Select
                                options={[{ value: "December 2024", label: "December 2024" }]}
                                value="December 2024"
                                className="w-full h-11 bg-white text-black text-sm font-normal font-inter border border-gray-300 appearance-none pr-10"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDownIconLarge />
                            </div>
                        </div>
                    </div>
                    <ExportButton
                        text={t('report.exportMonthlyExcel')}
                        className="w-full lg:w-auto"
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
                    <div className="w-full lg:flex-1">
                        <ReusableInput
                            ref={startDateRef}
                            label={t('report.startDate')}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            type="date"
                            iconRight={
                                <div
                                    className="cursor-pointer"
                                    onClick={() => startDateRef.current?.showPicker()}
                                >
                                    <CalendarIconLarge />
                                </div>
                            }
                            classes="h-11 md:h-11 rounded-md border border-gray-300 bg-white !text-black text-sm font-normal font-inter [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                    </div>
                    <div className="w-full lg:flex-1">
                        <ReusableInput
                            ref={endDateRef}
                            label={t('report.endDate')}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            type="date"
                            iconRight={
                                <div
                                    className="cursor-pointer"
                                    onClick={() => endDateRef.current?.showPicker()}
                                >
                                    <CalendarIconLarge className="w-5 h-5" />
                                </div>
                            }
                            classes="h-11 md:h-11 rounded-md border border-gray-300 bg-white !text-black text-sm font-normal font-inter [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                    </div>
                    <div className="w-full lg:flex-1">
                        <CustomLabel label={t('report.exportFormat')} />
                        <div className="relative">
                            <Select
                                options={[{ value: "Excel (.xlsx)", label: "Excel (.xlsx)" }]}
                                value="Excel (.xlsx)"
                                className="w-full h-11 bg-white text-black text-sm font-normal font-inter border border-gray-300 appearance-none pr-10"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDownIconLarge />
                            </div>
                        </div>
                    </div>
                    <ExportButton text={t('report.exportRange')} className="w-full lg:flex-1" />
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
                            <div className="relative">
                                <Select
                                    options={[{ value: "John Smith", label: "John Smith" }]}
                                    value="John Smith"
                                    className="w-full h-11 bg-white text-black text-sm font-normal font-inter border border-gray-300 appearance-none pr-10"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronDownIconLarge />
                                </div>
                            </div>
                        </div>
                        <div>
                            <CustomLabel label={t('report.month')} />
                            <div className="relative">
                                <Select
                                    options={[{ value: "December 2024", label: "December 2024" }]}
                                    value="December 2024"
                                    className="w-full h-11 bg-white text-black text-sm font-normal font-inter border border-gray-300 appearance-none pr-10"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronDownIconLarge />
                                </div>
                            </div>
                        </div>
                        <ExportButton text={t('report.exportEmployeeAttendance')} className="w-full" />
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
                            <div className="relative">
                                <Select
                                    options={[{ value: "Main Office - Downtown", label: "Main Office - Downtown" }]}
                                    value="Main Office - Downtown"
                                    className="w-full h-11 bg-white text-black text-sm font-normal font-inter border border-gray-300 appearance-none pr-10"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronDownIconLarge />
                                </div>
                            </div>
                        </div>
                        <div>
                            <CustomLabel label={t('report.month')} />
                            <div className="relative">
                                <Select
                                    options={[{ value: "December 2024", label: "December 2024" }]}
                                    value="December 2024"
                                    className="w-full h-11 bg-white text-black text-sm font-normal font-inter border border-gray-300 appearance-none pr-10"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <ChevronDownIconLarge />
                                </div>
                            </div>
                        </div>
                        <ExportButton text={t('report.exportWorkplaceAttendance')} className="w-full" />
                    </div>
                </ExportCard>
            </div>
        </div>
    );
};

export default ReportExport;
