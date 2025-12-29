import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, QrCode, Download, Printer, Info, Check, Image as ImageIcon, FileText } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';
import ReusableInput from "../../../../components/ReusableInput";
import Select from "../../../../components/Form/Select";
import DashboardBanner from "../../../../components/DashboardBanner";

const WorkPlaceQrForm = ({ onBack }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        companyName: "",
        workplaceLocation: "",
        department: "",
        contactNumber: "",
        email: "",
    });
    const [qrCodeValue, setQrCodeValue] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerate = () => {
        // Basic validation: Ensure at least Company Name and Workplace Location are present
        if (!formData.companyName || !formData.workplaceLocation) {
            alert(t('qrCode.fillRequired') || "Please fill in Company Name and Workplace Location to generate QR code.");
            return;
        }

        // Create a structured string or JSON for the QR code
        // Simple JSON format for now
        const qrContent = JSON.stringify({
            c: formData.companyName,
            w: formData.workplaceLocation,
            d: formData.department,
            p: formData.contactNumber,
            e: formData.email,
            ts: Date.now() // Timestamp to make unique if needed
        });

        setQrCodeValue(qrContent);
    };

    const handleDownloadPNG = () => {
        const canvas = document.getElementById('qr-code-canvas');
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `QR_${formData.companyName.replace(/\s+/g, '_')}_${formData.workplaceLocation}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const workplaceOptions = [
        { label: "New York Office", value: "ny" },
        { label: "London Office", value: "london" },
        { label: "Remote", value: "remote" },
    ];

    const departmentOptions = [
        { label: "Human Resources", value: "hr" },
        { label: "Engineering", value: "eng" },
        { label: "Sales", value: "sales" },
        { label: "Marketing", value: "mkt" },
    ];

    return (
        <div className="w-full space-y-6">
            <DashboardBanner
                title={t('qrCode.generateTitle')}
                description={t('qrCode.generateDesc')}
                onBack={onBack}
            />

            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Left Section - Form */}
                <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                            <Building2 className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-[#111827] text-lg font-bold font-inter leading-6">
                                {t('workplace.selectWorkplaceTitle')}
                            </h2>
                            <p className="text-gray-400 text-sm font-medium mt-1">
                                {t('workplace.selectWorkplaceDesc')}
                            </p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5 flex-grow">
                        {/* Company Name */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                {t('workplace.companyName')}
                            </label>
                            <ReusableInput
                                name="companyName"
                                placeholder={t('common.enter')}
                                value={formData.companyName}
                                onChange={handleChange}
                                backgroundColor="bg-gray-50"
                                border="border-gray-200"
                                classes="h-12 rounded-xl text-sm"
                            />
                        </div>

                        {/* Workplace Location */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                {t('workplace.location')}
                            </label>
                            <Select
                                name="workplaceLocation"
                                value={formData.workplaceLocation}
                                onChange={handleChange}
                                options={workplaceOptions}
                                placeholder={t('workplace.selectWorkplaceTitle')}
                                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                {t('employee.department')}
                            </label>
                            <ReusableInput
                                name="department"
                                placeholder={t('common.enter')}
                                value={formData.department}
                                onChange={handleChange}
                                backgroundColor="bg-gray-50"
                                border="border-gray-200"
                                classes="h-12 rounded-xl text-sm"
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                {t('employee.contact')}
                            </label>
                            <ReusableInput
                                name="contactNumber"
                                placeholder={t('common.enter')}
                                type="tel"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                backgroundColor="bg-gray-50"
                                border="border-gray-200"
                                classes="h-12 rounded-xl text-sm"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-[13px] font-semibold flex items-center gap-1">
                                {t('table.email')}
                            </label>
                            <ReusableInput
                                name="email"
                                placeholder={t('common.enter')}
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                backgroundColor="bg-gray-50"
                                border="border-gray-200"
                                classes="h-12 rounded-xl text-sm"
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="mt-8 pt-6">
                        <button
                            onClick={handleGenerate}
                            className="w-full h-12 bg-[#22B3E8] hover:bg-[#1fa0d1] transition-colors rounded-xl shadow-lg shadow-sky-100 flex items-center justify-center gap-2 text-white font-bold text-sm"
                        >
                            <QrCode size={18} />
                            <span>{t('qrCode.generateQrCode')}</span>
                        </button>
                    </div>
                </div>

                {/* Right Section - Preview */}
                <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col h-full relative">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                            <QrCode className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-[#111827] text-lg font-bold font-inter leading-6">
                                {t('workplace.qrPreviewTitle')}
                            </h2>
                            <p className="text-gray-400 text-sm font-medium mt-1">
                                {t('workplace.qrPreviewDesc')}
                            </p>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="w-full aspect-square max-h-[300px] mx-auto bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-8 relative">
                        {qrCodeValue ? (
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                                <QRCodeCanvas
                                    id="qr-code-canvas"
                                    value={qrCodeValue}
                                    size={200}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                                    <QrCode className="text-gray-400" size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm font-bold">
                                        {t('workplace.noQrCode')}
                                    </p>
                                    <p className="text-gray-400 text-xs font-medium mt-1">
                                        {t('workplace.noQrCodeDesc')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleDownloadPNG}
                            disabled={!qrCodeValue}
                            className={`w-full h-11 transition-colors rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 ${!qrCodeValue ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#4285F4] hover:bg-blue-600'}`}
                        >
                            <ImageIcon size={16} />
                            {t('common.download')} PNG
                        </button>
                        <button
                            disabled={!qrCodeValue}
                            className={`w-full h-11 border transition-colors rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${!qrCodeValue ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                            <FileText size={16} />
                            {t('common.download')} PDF
                        </button>
                        <button
                            disabled={!qrCodeValue}
                            onClick={() => window.print()}
                            className={`w-full h-11 border transition-colors rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${!qrCodeValue ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Printer size={16} />
                            {t('qrCode.print')}
                        </button>
                    </div>

                    {/* Quick Tip */}
                    <div className="mt-8 bg-[#E3F2FD] rounded-xl border border-[#BBDEFB] p-4 flex gap-3">
                        <div className="mt-0.5 shrink-0 text-[#1976D2]">
                            <Info size={16} />
                        </div>
                        <div>
                            <h4 className="text-[#0D47A1] text-xs font-bold font-inter">
                                {t('workplace.quickTip')}
                            </h4>
                            <p className="text-[#1565C0] text-xs font-medium font-inter leading-relaxed mt-1">
                                {t('workplace.quickTipDesc')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkPlaceQrForm;
