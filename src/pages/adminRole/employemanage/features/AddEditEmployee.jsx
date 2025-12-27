import React from "react";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { LuPlus } from "react-icons/lu";
import ReusableInput from "../../../../components/ReusableInput";
import Select from "../../../../components/Form/Select";
import DashboardBanner from "../../../../components/DashboardBanner";

const AddEditEmployee = ({ onBack }) => {
    const { t } = useTranslation();

    return (
        <div className="w-full space-y-6">
            <DashboardBanner
                title={t('employee.addEditTitle')}
                description={t('employee.managementDesc')} // Use managementDesc or similar generic desc
                onBack={onBack}
            />

            {/* Form Section */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="mb-8">
                    <h2 className="text-[#111827] text-lg font-bold font-inter">{t('employee.basicInfo')}</h2>
                    <p className="text-gray-400 text-sm font-medium mt-1">{t('employee.basicInfoDesc')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                            {t('employee.fullName')}<span className="text-red-500">*</span>
                        </label>
                        <ReusableInput
                            placeholder={t('employee.fullNamePlaceholder')}
                            classes="h-12 rounded-xl border-gray-200 focus:ring-sky-500/20"
                        />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                            {t('employee.emailAddress')}<span className="text-red-500">*</span>
                        </label>
                        <ReusableInput
                            placeholder={t('employee.emailPlaceholder')}
                            classes="h-12 rounded-xl border-gray-200 focus:ring-sky-500/20"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold">
                            {t('employee.phoneOptional')}
                        </label>
                        <ReusableInput
                            placeholder={t('employee.phonePlaceholder')}
                            classes="h-12 rounded-xl border-gray-200 focus:ring-sky-500/20"
                        />
                    </div>

                    {/* Position */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                            {t('table.role') || "Position"}<span className="text-red-500">*</span>
                        </label>
                        <ReusableInput
                            placeholder={t('employee.positionPlaceholder')}
                            classes="h-12 rounded-xl border-gray-200 focus:ring-sky-500/20"
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div className="space-y-2">
                        <label className="text-gray-700 text-[13px] font-semibold">
                            {t('employee.selectRole')}
                        </label>
                        <Select
                            placeholder={t('employee.chooseRole')}
                            className="w-full h-12 bg-white text-gray-700 rounded-xl border border-gray-200"
                            options={[
                                { label: t('employee.admin'), value: "admin" },
                                { label: t('employee.user'), value: "user" },
                                { label: t('employee.contractor'), value: "contractor" }
                            ]}
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end items-center gap-4 mt-10">
                    <button
                        onClick={onBack}
                        className="px-8 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4FC3F7] text-white font-bold text-sm shadow-md shadow-sky-100 hover:bg-[#29B6F6] transition-transform active:scale-95">
                        <LuPlus size={18} />
                        {t('employee.createBtn')}
                    </button>
                </div>
            </div>

            {/* Help Alert */}
            <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-xl p-4 flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-500 text-white mt-0.5">
                    <Info size={14} />
                </div>
                <div>
                    <h4 className="text-[#0D47A1] text-sm font-bold font-inter">{t('employee.needHelp')}</h4>
                    <p className="text-[#1976D2] text-[13px] font-medium mt-0.5 font-inter">
                        {t('employee.helpDesc')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddEditEmployee;
