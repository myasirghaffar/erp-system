import React, { useState } from "react";
import { Upload, Clock, FileText, Check, Save } from "lucide-react";
import DashboardBanner from "../../../components/DashboardBanner";
import ReusableInput from "../../../components/ReusableInput";
import Select from "../../../components/Form/Select";

const SettingsPage = () => {
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
        { label: "United States", value: "usa" },
        { label: "United Kingdom", value: "uk" },
        { label: "Canada", value: "ca" },
        { label: "India", value: "in" }
    ];

    const timezoneOptions = [
        { label: "UTC-8 (Pacific Time)", value: "pst" },
        { label: "UTC-5 (Eastern Time)", value: "est" },
        { label: "UTC+0 (GMT)", value: "gmt" },
        { label: "UTC+5:30 (IST)", value: "ist" }
    ];
    
    const overtimeRateOptions = [
        { label: "1.25x (Standard)", value: "1.25" },
        { label: "1.5x (Time and a half)", value: "1.5" },
        { label: "2.0x (Double Time)", value: "2.0" }
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
                    title="Company Settings"
                    description="Manage your company information and branding"
                    rightContent={
                         <button className="bg-[#22B3E8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm">
                            <Save size={16} /> Save Changes
                        </button>
                    }
                />

                {/* Company Information Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="space-y-6">
                        {/* Company Name */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-xs font-bold font-inter">Company Name</label>
                            <ReusableInput
                                name="name"
                                value={companyInfo.name}
                                onChange={handleCompanyChange}
                                classes="h-12 rounded-xl text-sm font-medium"
                            />
                        </div>

                        {/* Company Logo */}
                        <div className="space-y-2">
                             <label className="text-gray-700 text-xs font-bold font-inter">Company Logo</label>
                             <div className="flex items-center gap-4">
                                 <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                                     <ImagePlaceholder />
                                 </div>
                                 <div>
                                     <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors bg-white">
                                         <Upload size={16} />
                                         Upload Logo
                                     </button>
                                     <p className="text-gray-400 text-xs font-medium mt-1.5">PNG, JPG up to 2MB. Recommended 200x200px</p>
                                 </div>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Country */}
                            <div className="space-y-2">
                                <label className="text-gray-700 text-xs font-bold font-inter">Country</label>
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
                                <label className="text-gray-700 text-xs font-bold font-inter">Timezone</label>
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
                     <h2 className="text-[#111827] text-lg font-bold font-inter">Working Hours & Compliance Settings</h2>
                     <p className="text-gray-400 text-sm font-medium mt-1">Configure working hours, overtime rules, and data compliance settings</p>
                </div>

                {/* Working Hours Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                     <div className="flex items-start gap-4 mb-8">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <Clock className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h3 className="text-[#111827] text-base font-bold font-inter">Working Hours Rules</h3>
                            <p className="text-gray-400 text-sm font-medium">Set daily start/end times and minimum hours requirements</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Daily Start/End Time */}
                         <div className="space-y-4">
                             <label className="text-gray-700 text-xs font-bold font-inter">Daily Start/End Time</label>
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                     <label className="text-gray-500 text-[11px] font-semibold mb-1 block">Start Time</label>
                                     <ReusableInput
                                        name="startTime"
                                        type="time"
                                        value={workingHours.startTime}
                                        onChange={handleWorkingHoursChange}
                                        classes="h-12 rounded-xl text-sm font-medium"
                                     />
                                 </div>
                                 <div>
                                     <label className="text-gray-500 text-[11px] font-semibold mb-1 block">End Time</label>
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
                             <label className="text-gray-700 text-xs font-bold font-inter">Minimum Hours</label>
                             <div>
                                 <label className="text-gray-500 text-[11px] font-semibold mb-1 block">Daily Minimum</label>
                                 <ReusableInput
                                    name="dailyMin"
                                    type="number"
                                    value={workingHours.dailyMin}
                                    onChange={handleWorkingHoursChange}
                                    classes="h-12 rounded-xl text-sm font-medium"
                                 />
                             </div>
                              <div>
                                 <label className="text-gray-500 text-[11px] font-semibold mb-1 block">Weekly Minimum</label>
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
                             <Save size={16} /> Save Working Hours
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
                            <h3 className="text-[#111827] text-base font-bold font-inter">Overtime & Break Rules</h3>
                            <p className="text-gray-400 text-sm font-medium">Configure break deduction and overtime calculation rules</p>
                        </div>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Break Deduction Rules */}
                         <div className="space-y-4">
                             <label className="text-gray-700 text-xs font-bold font-inter">Break Deduction Rules</label>
                             <div>
                                 <label className="text-gray-500 text-[11px] font-semibold mb-1 block">Lunch Break Duration (minutes)</label>
                                 <ReusableInput
                                    name="lunchBreak"
                                    type="number"
                                    value={overtimeRules.lunchBreak}
                                    onChange={handleOvertimeChange}
                                    classes="h-12 rounded-xl text-sm font-medium"
                                 />
                             </div>
                              <div>
                                 <label className="text-gray-500 text-[11px] font-semibold mb-1 block">Short Break Duration (minutes)</label>
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
                                <label htmlFor="autoDeduct" className="text-gray-500 text-xs font-medium cursor-pointer">Auto-deduct breaks</label>
                             </div>
                         </div>
                         
                         {/* Overtime Calculation */}
                         <div className="space-y-4">
                             <label className="text-gray-700 text-xs font-bold font-inter">Overtime Calculation</label>
                             <div>
                                 <label className="text-gray-500 text-[11px] font-semibold mb-1 block">Overtime Threshold (hours)</label>
                                 <ReusableInput
                                    name="overtimeThreshold"
                                    type="number"
                                    value={overtimeRules.overtimeThreshold}
                                    onChange={handleOvertimeChange}
                                    classes="h-12 rounded-xl text-sm font-medium"
                                 />
                             </div>
                              <div>
                                 <label className="text-gray-500 text-[11px] font-semibold mb-1 block">Overtime Rate Multiplier</label>
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
                             <Save size={16} /> Save Overtime Rules
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
