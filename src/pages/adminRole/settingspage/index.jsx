import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Save, Loader2 } from "lucide-react";
import DashboardBanner from "../../../components/DashboardBanner";
import ReusableInput from "../../../components/ReusableInput";
import Select from "../../../components/Form/Select";
import {
    useGetCompanySettingsQuery,
    useUpdateCompanyInfoMutation,
    useUploadCompanyLogoMutation,
} from "../../../services/Api";
import { toast } from "react-toastify";

const SettingsPage = () => {
    const { t } = useTranslation();

    // Fetch company settings from backend
    const { 
        data: companySettingsData, 
        isLoading: isLoadingSettings,
        isError: isErrorLoading,
        error: loadError
    } = useGetCompanySettingsQuery();

    const [updateCompanyInfo, { isLoading: isSavingCompanyInfo }] = useUpdateCompanyInfoMutation();
    const [uploadCompanyLogo, { isLoading: isUploadingLogo }] = useUploadCompanyLogoMutation();

    // Form States - initialized from backend
    const [companyInfo, setCompanyInfo] = useState({
        name: "",
        logo: "",
        country: "usa",
        timezone: "pst"
    });

    // Load settings from API when available
    useEffect(() => {
        if (companySettingsData?.data?.settings) {
            const settings = companySettingsData.data.settings;
            
            // Map API settings to form state
            setCompanyInfo({
                name: settings.company_name || "",
                logo: settings.company_logo || "",
                country: settings.country || "usa",
                timezone: settings.timezone || "pst"
            });
        }
    }, [companySettingsData]);

    // Show error toast if loading fails
    useEffect(() => {
        if (isErrorLoading && loadError) {
            toast.error(loadError?.data?.message || t('settings.loadError') || "Failed to load settings");
        }
    }, [isErrorLoading, loadError, t]);

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

    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyInfo(prev => ({ ...prev, [name]: value }));
    };

    // Handle file input change
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast.error(t('settings.invalidFileType') || "Only PNG, JPG, and JPEG files are allowed");
            return;
        }

        // Validate file size (2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            toast.error(t('settings.fileTooLarge') || "File size must be less than 2MB");
            return;
        }

        try {
            // Create FormData
            const formData = new FormData();
            formData.append('logo', file);

            // Upload logo
            const result = await uploadCompanyLogo(formData).unwrap();
            
            // Update local state with new logo URL
            if (result?.data?.logo_url) {
                setCompanyInfo(prev => ({ ...prev, logo: result.data.logo_url }));
                toast.success(t('settings.logoUploaded') || "Your company logo has been updated successfully!");
            }
        } catch (error) {
            toast.error(error?.data?.message || t('settings.uploadError') || "Failed to upload logo");
        }

        // Reset file input
        e.target.value = '';
    };

    // Handle save company info
    const handleSaveCompanyInfo = async () => {
        try {
            await updateCompanyInfo({
                data: {
                    company_name: companyInfo.name,
                    company_logo: companyInfo.logo || null,
                    country: companyInfo.country,
                    timezone: companyInfo.timezone
                }
            }).unwrap();

            toast.success(t('settings.companyInfoSaved') || "Company information saved successfully");
        } catch (error) {
            toast.error(error?.data?.message || t('settings.saveError') || "Failed to save company information");
        }
    };

    // Loading state
    if (isLoadingSettings) {
        return (
            <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#22B3E8]" />
                    <p className="text-gray-600">{t('settings.loading') || "Loading settings..."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 pb-20 overflow-x-hidden">
            <div className="space-y-6 max-w-full">
                {/* Company Information Section */}
                <DashboardBanner
                    title={t('settings.companyTitle')}
                    description={t('settings.companyDescription')}
                    rightContent={
                        <button 
                            onClick={handleSaveCompanyInfo}
                            disabled={isSavingCompanyInfo}
                            className="bg-[#22B3E8] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1fa0d1] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                        >
                            {isSavingCompanyInfo ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {t('settings.saveChanges')}
                        </button>
                    }
                />

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
                                placeholder={t('settings.companyNamePlaceholder') || "Enter company name"}
                            />
                        </div>

                        {/* Company Logo */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-xs font-bold font-inter">{t('settings.companyLogo')}</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
                                    {companyInfo.logo ? (
                                        <img src={companyInfo.logo} alt="Company Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImagePlaceholder />
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        id="logo-upload"
                                        accept="image/jpeg,image/jpg,image/png"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={isUploadingLogo}
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors bg-white cursor-pointer ${isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isUploadingLogo ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Upload size={16} />
                                        )}
                                        {isUploadingLogo ? (t('settings.uploading') || "Uploading...") : (t('settings.uploadLogo') || "Upload Logo")}
                                    </label>
                                    <p className="text-gray-400 text-xs font-medium mt-1.5">{t('settings.uploadDesc') || "PNG, JPG up to 2MB"}</p>
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
