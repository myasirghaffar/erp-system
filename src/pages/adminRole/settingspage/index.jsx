import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Clock, FileText, Check, Save } from "lucide-react";
import DashboardBanner from "../../../components/DashboardBanner";
import ReusableInput from "../../../components/ReusableInput";
import Select from "../../../components/Form/Select";

const SettingsPage = () => {
    const { t } = useTranslation();

    // Form States
    const [companyInfo, setCompanyInfo] = useState({
        name: "Acme Corporation",
        country: "usa",
        timezone: "pst"
    });

    // Working Hours State
    const [workingHours, setWorkingHours] = useState({
        startTime: "09:00",
        endTime: "17:00",
        dailyMin: "8",
        weeklyMin: "40"
    });

    // Overtime Rules State
    const [overtimeRules, setOvertimeRules] = useState({
        lunchBreak: "60",
        shortBreak: "15",
        overtimeThreshold: "8",
        overtimeRate: "1.5",
        autoDeduct: false
    });

    // Options
    const countryOptions = [
        { label: t('settings.usa'), value: "usa" },
        { label: t('settings.uk'), value: "uk" },
        { label: t('settings.ca'), value: "ca" },
        { label: t('settings.in'), value: "in" }
    ];

    const timezoneOptions = [
        { label: t('settings.pst'), value: "pst" },
        { label: t('settings.est'), value: "est" },
        { label: t('settings.gmt'), value: "gmt" },
        { label: t('settings.ist'), value: "ist" }
    ];

    const overtimeRateOptions = [
        { label: t('settings.standard'), value: "1.25" },
        { label: t('settings.timeAHalf'), value: "1.5" },
        { label: t('settings.doubleTime'), value: "2.0" }
    ];


    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleWorkingHoursChange = (e) => {
        const { name, value } = e.target;
        setWorkingHours(prev => ({ ...prev, [name]: value }));
    };

    const handleOvertimeChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOvertimeRules(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
            <div className="space-y-6 max-w-full">
                <DashboardBanner
                    title={t('settings.companyTitle')}
                    description={t('settings.companyDescription')}
                    rightContent={
                        <button className="bg-[#22B3E8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm">
                            <Save size={16} /> {t('settings.saveChanges')}
                        </button>
                    }
                />

                {/* Company Information Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="space-y-6">
                        {/* Company Name */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-xs font-bold font-inter">{t('settings.companyName')}</label>
                            <ReusableInput
                                name="name"
                                value={companyInfo.name}
                                onChange={handleCompanyChange}
                                classes="h-12 rounded-xl text-sm font-medium"
                            />
                        </div>

                        {/* Company Logo */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-xs font-bold font-inter">{t('settings.companyLogo')}</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                                    <ImagePlaceholder />
                                </div>
                                <div>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors bg-white">
                                        <Upload size={16} />
                                        {t('settings.uploadLogo')}
                                    </button>
                                    <p className="text-gray-400 text-xs font-medium mt-1.5">{t('settings.uploadDesc')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Country */}
                            <div className="space-y-2">
                                <label className="text-gray-700 text-xs font-bold font-inter">{t('settings.country')}</label>
                                <Select
                                    name="country"
                                    value={companyInfo.country}
                                    onChange={handleCompanyChange}
                                    options={countryOptions}
                                    className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
                                />
                            </div>
                            {/* Timezone */}
                            <div className="space-y-2">
                                <label className="text-gray-700 text-xs font-bold font-inter">{t('settings.timezone')}</label>
                                <Select
                                    name="timezone"
                                    value={companyInfo.timezone}
                                    onChange={handleCompanyChange}
                                    options={timezoneOptions}
                                    className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Header */}
                <div className="mt-2">
                    <h2 className="text-[#111827] text-lg font-bold font-inter">{t('settings.workingHoursTitle')}</h2>
                    <p className="text-gray-400 text-sm font-medium mt-1">{t('settings.workingHoursDesc')}</p>
                </div>

                {/* Working Hours Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <Clock className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h3 className="text-[#111827] text-base font-bold font-inter">{t('settings.rulesTitle')}</h3>
                            <p className="text-gray-400 text-sm font-medium">{t('settings.rulesDesc')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Daily Start/End Time */}
                        <div className="space-y-4">
                            <label className="text-gray-700 text-xs font-bold font-inter">{t('settings.dailyStartEnd')}</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-500 text-[11px] font-semibold mb-1 block">{t('settings.startTime')}</label>
                                    <ReusableInput
                                        name="startTime"
                                        type="time"
                                        value={workingHours.startTime}
                                        onChange={handleWorkingHoursChange}
                                        classes="h-12 rounded-xl text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-500 text-[11px] font-semibold mb-1 block">{t('settings.endTime')}</label>
                                    <ReusableInput
                                        name="endTime"
                                        type="time"
                                        value={workingHours.endTime}
                                        onChange={handleWorkingHoursChange}
                                        classes="h-12 rounded-xl text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Minimum Hours */}
                        <div className="space-y-4">
                            <label className="text-gray-700 text-xs font-bold font-inter">{t('settings.minHours')}</label>
                            <div>
                                <label className="text-gray-500 text-[11px] font-semibold mb-1 block">{t('settings.dailyMin')}</label>
                                <ReusableInput
                                    name="dailyMin"
                                    type="number"
                                    value={workingHours.dailyMin}
                                    onChange={handleWorkingHoursChange}
                                    classes="h-12 rounded-xl text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-gray-500 text-[11px] font-semibold mb-1 block">{t('settings.weeklyMin')}</label>
                                <ReusableInput
                                    name="weeklyMin"
                                    type="number"
                                    value={workingHours.weeklyMin}
                                    onChange={handleWorkingHoursChange}
                                    classes="h-12 rounded-xl text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50">
                        <button className="bg-[#22B3E8] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm shadow-sky-100">
                            <Save size={16} /> {t('settings.saveWorkingHours')}
                        </button>
                    </div>
                </div>

                {/* Overtime & Break Rules Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                            <FileText className="text-blue-500" size={20} />
                        </div>
                        <div>
                            <h3 className="text-[#111827] text-base font-bold font-inter">{t('settings.overtimeTitle')}</h3>
                            <p className="text-gray-400 text-sm font-medium">{t('settings.overtimeDesc')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Break Deduction Rules */}
                        <div className="space-y-4">
                            <label className="text-gray-700 text-xs font-bold font-inter">{t('settings.breakRules')}</label>
                            <div>
                                <label className="text-gray-500 text-[11px] font-semibold mb-1 block">{t('settings.lunchBreak')}</label>
                                <ReusableInput
                                    name="lunchBreak"
                                    type="number"
                                    value={overtimeRules.lunchBreak}
                                    onChange={handleOvertimeChange}
                                    classes="h-12 rounded-xl text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-gray-500 text-[11px] font-semibold mb-1 block">{t('settings.shortBreak')}</label>
                                <ReusableInput
                                    name="shortBreak"
                                    type="number"
                                    value={overtimeRules.shortBreak}
                                    onChange={handleOvertimeChange}
                                    classes="h-12 rounded-xl text-sm font-medium"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="autoDeduct"
                                    name="autoDeduct"
                                    checked={overtimeRules.autoDeduct}
                                    onChange={handleOvertimeChange}
                                    className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer"
                                />
                                <label htmlFor="autoDeduct" className="text-gray-500 text-xs font-medium cursor-pointer">{t('settings.autoDeduct')}</label>
                            </div>
                        </div>

                        {/* Overtime Calculation */}
                        <div className="space-y-4">
                            <label className="text-gray-700 text-xs font-bold font-inter">{t('settings.overtimeCalc')}</label>
                            <div>
                                <label className="text-gray-500 text-[11px] font-semibold mb-1 block">{t('settings.overtimeThreshold')}</label>
                                <ReusableInput
                                    name="overtimeThreshold"
                                    type="number"
                                    value={overtimeRules.overtimeThreshold}
                                    onChange={handleOvertimeChange}
                                    classes="h-12 rounded-xl text-sm font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-gray-500 text-[11px] font-semibold mb-1 block">{t('settings.overtimeMultiplier')}</label>
                                <Select
                                    name="overtimeRate"
                                    value={overtimeRules.overtimeRate}
                                    onChange={handleOvertimeChange}
                                    options={overtimeRateOptions}
                                    className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50">
                        <button className="bg-[#22B3E8] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm shadow-sky-100">
                            <Save size={16} /> {t('settings.saveOvertime')}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ImagePlaceholder = () => (
    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export default SettingsPage;
