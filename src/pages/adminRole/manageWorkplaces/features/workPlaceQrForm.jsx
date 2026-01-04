import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Building2, QrCode, Download, Printer, Info, Check, Image as ImageIcon, FileText } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';
import ReusableInput from "../../../../components/ReusableInput";
import FlowbiteDatePicker from "../../../../components/FlowbiteDatePicker";
import Select from "../../../../components/Form/Select";
import DashboardBanner from "../../../../components/DashboardBanner";
import {
    useGetAllWorkplacesQuery,
    useCreateQRCodeMutation,
    useUpdateQRCodeMutation,
    useGetQRCodeByIdQuery,
} from "../../../../services/Api";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const WorkPlaceQrForm = ({ onBack, qrCodeId = null, workplaceId = null }) => {
    const { t } = useTranslation();
    const isEditMode = !!qrCodeId;

    // Fetch QR code data if editing
    const { data: qrCodeData } = useGetQRCodeByIdQuery(qrCodeId, {
        skip: !isEditMode,
    });

    // Fetch workplaces for dropdown
    const { data: workplacesData } = useGetAllWorkplacesQuery({ limit: 100 });

    const [formData, setFormData] = useState({
        workplace_id: workplaceId || "",
        company_name: "",
        department: "",
        contact_number: "",
        email: "",
        expires_at: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [qrCodeValue, setQrCodeValue] = useState(null);
    const qrCodeCanvasRef = useRef(null);

    const [createQRCode, { isLoading: isCreating }] = useCreateQRCodeMutation();
    const [updateQRCode, { isLoading: isUpdating }] = useUpdateQRCodeMutation();

    // Load QR code data if in edit mode
    useEffect(() => {
        if (qrCodeData?.data) {
            const qr = qrCodeData.data.qrCode || qrCodeData.data;
            setFormData({
                workplace_id: qr.workplace_id?.toString() || "",
                company_name: qr.company_name || "",
                department: qr.department || "",
                contact_number: qr.contact_number || "",
                email: qr.email || "",
                expires_at: qr.expires_at ? new Date(qr.expires_at).toISOString().split('T')[0] : "",
            });
            // Generate QR code value from secure code (UUID) - following international standards
            // Using the secure UUID code for cryptographic security and unpredictability
            // This follows ISO/IEC 18004 standard and security best practices
            if (qr.code) {
                setQrCodeValue(qr.code);
            }
        }
    }, [qrCodeData]);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        if (!phone) return false;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone) && phone.length >= 7 && phone.length <= 20;
    };

    const validateForm = () => {
        const newErrors = {};

        // Workplace ID validation
        if (!formData.workplace_id) {
            newErrors.workplace_id = t('qrCode.validation.workplaceRequired') || "Workplace is required";
        }

        // Company name validation
        if (!formData.company_name.trim()) {
            newErrors.company_name = t('qrCode.validation.companyNameRequired') || "Company name is required";
        } else if (formData.company_name.trim().length < 1) {
            newErrors.company_name = t('qrCode.validation.companyNameMin') || "Company name is required";
        } else if (formData.company_name.trim().length > 100) {
            newErrors.company_name = t('qrCode.validation.companyNameMax') || "Company name must be less than 100 characters";
        }

        // Department validation
        if (!formData.department.trim()) {
            newErrors.department = t('qrCode.validation.departmentRequired') || "Department is required";
        } else if (formData.department.trim().length < 1) {
            newErrors.department = t('qrCode.validation.departmentMin') || "Department is required";
        } else if (formData.department.trim().length > 100) {
            newErrors.department = t('qrCode.validation.departmentMax') || "Department must be less than 100 characters";
        }

        // Contact number validation
        if (!formData.contact_number.trim()) {
            newErrors.contact_number = t('qrCode.validation.contactRequired') || "Contact number is required";
        } else if (!validatePhone(formData.contact_number)) {
            newErrors.contact_number = t('qrCode.validation.contactInvalid') || "Contact number must be a valid international format (e.g., +1234567890)";
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = t('qrCode.validation.emailRequired') || "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = t('qrCode.validation.emailInvalid') || "Please provide a valid email";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error(t('qrCode.validation.formErrors') || "Please fix the form errors");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                workplace_id: parseInt(formData.workplace_id),
                company_name: formData.company_name.trim(),
                department: formData.department.trim(),
                contact_number: formData.contact_number.trim(),
                email: formData.email.trim(),
                expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : undefined,
            };

            let result;
            if (isEditMode) {
                result = await updateQRCode({
                    id: qrCodeId,
                    data: payload,
                }).unwrap();
            } else {
                result = await createQRCode({ data: payload }).unwrap();
            }

            // Generate QR code value from secure code (UUID) - following international standards
            // Using the secure UUID code for cryptographic security and unpredictability
            // This follows ISO/IEC 18004 standard and security best practices
            const qrCode = result?.data?.qrCode || result?.data;
            if (qrCode?.code) {
                setQrCodeValue(qrCode.code);
            }

            toast.success(
                isEditMode
                    ? (t('qrCode.updateSuccess') || "QR code updated successfully")
                    : (t('qrCode.createSuccess') || "QR code created successfully")
            );

            // Don't close form immediately - let user download QR code
            // onBack();
        } catch (error) {
            if (error?.data?.errors) {
                const backendErrors = {};
                error.data.errors.forEach((err) => {
                    const field = err.path || err.param;
                    backendErrors[field] = err.msg || err.message;
                });
                setErrors(backendErrors);
                toast.error(t('qrCode.validation.backendErrors') || "Please fix the validation errors");
            } else {
                toast.error(error?.data?.message || t('qrCode.saveError') || "Failed to save QR code");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadPNG = () => {
        if (!qrCodeValue) {
            toast.error(t('qrCode.noQrCodeToDownload') || "No QR code available to download");
            return;
        }

        // Get the canvas element from the QRCodeCanvas component
        const canvas = qrCodeCanvasRef.current?.querySelector('canvas');
        if (canvas) {
            try {
                const pngUrl = canvas.toDataURL("image/png", 1.0);
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                const fileName = `QR_${formData.company_name?.replace(/\s+/g, '_') || 'Code'}_${Date.now()}.png`;
                downloadLink.download = fileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                toast.success(t('qrCode.downloadSuccess') || "QR code downloaded successfully");
            } catch (error) {
                console.error("Error downloading PNG:", error);
                toast.error(t('qrCode.downloadError') || "Failed to download QR code");
            }
        } else {
            toast.error(t('qrCode.canvasNotFound') || "QR code canvas not found");
        }
    };

    const handleDownloadPDF = () => {
        if (!qrCodeValue) {
            toast.error(t('qrCode.noQrCodeToDownload') || "No QR code available to download");
            return;
        }

        const canvas = qrCodeCanvasRef.current?.querySelector('canvas');
        if (canvas) {
            try {
                const imgData = canvas.toDataURL("image/png", 1.0);
                
                // Create PDF with A4 size
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                // Calculate dimensions to center the QR code
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const qrSize = 80; // QR code size in mm
                const x = (pdfWidth - qrSize) / 2;
                const y = (pdfHeight - qrSize) / 2 - 20;

                // Add QR code image
                pdf.addImage(imgData, 'PNG', x, y, qrSize, qrSize);

                // Add company information below QR code
                const textY = y + qrSize + 15;
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "bold");
                pdf.text(formData.company_name || "Company", pdfWidth / 2, textY, { align: 'center' });
                
                pdf.setFontSize(10);
                pdf.setFont("helvetica", "normal");
                pdf.text(formData.department || "", pdfWidth / 2, textY + 8, { align: 'center' });
                
                if (formData.contact_number) {
                    pdf.text(formData.contact_number, pdfWidth / 2, textY + 14, { align: 'center' });
                }
                if (formData.email) {
                    pdf.text(formData.email, pdfWidth / 2, textY + 20, { align: 'center' });
                }

                // Save PDF
                const fileName = `QR_${formData.company_name?.replace(/\s+/g, '_') || 'Code'}_${Date.now()}.pdf`;
                pdf.save(fileName);
                toast.success(t('qrCode.downloadSuccess') || "QR code PDF downloaded successfully");
            } catch (error) {
                console.error("Error downloading PDF:", error);
                toast.error(t('qrCode.downloadError') || "Failed to download QR code PDF");
            }
        } else {
            toast.error(t('qrCode.canvasNotFound') || "QR code canvas not found");
        }
    };

    const handlePrint = () => {
        if (!qrCodeValue) {
            toast.error(t('qrCode.noQrCodeToPrint') || "No QR code available to print");
            return;
        }

        const canvas = qrCodeCanvasRef.current?.querySelector('canvas');
        if (canvas) {
            try {
                const imgData = canvas.toDataURL("image/png", 1.0);
                const printWindow = window.open('', '_blank');
                
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>QR Code - ${formData.company_name || 'Print'}</title>
                        <style>
                            @media print {
                                @page {
                                    margin: 20mm;
                                    size: A4;
                                }
                                body {
                                    margin: 0;
                                    padding: 0;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    justify-content: center;
                                    min-height: 100vh;
                                    font-family: Arial, sans-serif;
                                }
                            }
                            body {
                                margin: 0;
                                padding: 20px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                min-height: 100vh;
                                font-family: Arial, sans-serif;
                            }
                            .qr-container {
                                text-align: center;
                            }
                            .qr-code {
                                margin: 20px 0;
                            }
                            .company-info {
                                margin-top: 20px;
                            }
                            .company-name {
                                font-size: 18px;
                                font-weight: bold;
                                margin-bottom: 10px;
                            }
                            .info-text {
                                font-size: 12px;
                                margin: 5px 0;
                                color: #666;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="qr-container">
                            <div class="qr-code">
                                <img src="${imgData}" alt="QR Code" style="max-width: 300px; height: auto;" />
                            </div>
                            <div class="company-info">
                                <div class="company-name">${formData.company_name || ''}</div>
                                ${formData.department ? `<div class="info-text">${formData.department}</div>` : ''}
                                ${formData.contact_number ? `<div class="info-text">${formData.contact_number}</div>` : ''}
                                ${formData.email ? `<div class="info-text">${formData.email}</div>` : ''}
                            </div>
                        </div>
                        <script>
                            window.onload = function() {
                                window.print();
                            };
                        </script>
                    </body>
                    </html>
                `);
                printWindow.document.close();
            } catch (error) {
                console.error("Error printing QR code:", error);
                toast.error(t('qrCode.printError') || "Failed to print QR code");
            }
        } else {
            toast.error(t('qrCode.canvasNotFound') || "QR code canvas not found");
        }
    };

    // Prepare workplace options
    const workplaceOptions = workplacesData?.data?.workplaces
        ? workplacesData.data.workplaces.map((wp) => ({
              label: wp.name,
              value: wp.id.toString(),
          }))
        : [];

    return (
        <div className="w-full space-y-6">
            <DashboardBanner
                title={isEditMode ? (t('qrCode.editTitle') || "Edit QR Code") : (t('qrCode.generateTitle') || "Generate QR Code")}
                description={t('qrCode.generateDesc') || "Create a QR code for workplace attendance"}
                onBack={onBack}
            />

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Left Section - Form */}
                <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                            <Building2 className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-[#111827] text-lg font-bold font-inter leading-6">
                                {t('workplace.selectWorkplaceTitle') || "Workplace Information"}
                            </h2>
                            <p className="text-gray-400 text-sm font-medium mt-1">
                                {t('workplace.selectWorkplaceDesc') || "Select workplace and enter details"}
                            </p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5 flex-grow">
                        {/* Workplace Selection */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-xs font-bold font-inter flex items-center gap-1">
                                {t('workplace.title') || "Workplace"}<span className="text-red-500">*</span>
                            </label>
                            <Select
                                name="workplace_id"
                                value={formData.workplace_id}
                                onChange={(e) => handleSelectChange("workplace_id", e.target.value)}
                                options={workplaceOptions}
                                placeholder={t('workplace.selectWorkplaceTitle') || "Select workplace"}
                                className={`w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.workplace_id ? 'border-red-500' : ''}`}
                            />
                            {errors.workplace_id && (
                                <p className="text-red-500 text-xs font-medium mt-1">{errors.workplace_id}</p>
                            )}
                        </div>

                        {/* Company Name */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-xs font-bold font-inter flex items-center gap-1">
                                {t('workplace.companyName') || "Company Name"}<span className="text-red-500">*</span>
                            </label>
                            <ReusableInput
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                placeholder={t('common.enter') || "Enter company name"}
                                backgroundColor="bg-gray-50"
                                border={errors.company_name ? "border-red-500" : "border-gray-200"}
                                classes="h-12 rounded-xl text-sm"
                            />
                            {errors.company_name && (
                                <p className="text-red-500 text-xs font-medium mt-1">{errors.company_name}</p>
                            )}
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-xs font-bold font-inter flex items-center gap-1">
                                {t('employee.department') || "Department"}<span className="text-red-500">*</span>
                            </label>
                            <ReusableInput
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder={t('common.enter') || "Enter department"}
                                backgroundColor="bg-gray-50"
                                border={errors.department ? "border-red-500" : "border-gray-200"}
                                classes="h-12 rounded-xl text-sm"
                            />
                            {errors.department && (
                                <p className="text-red-500 text-xs font-medium mt-1">{errors.department}</p>
                            )}
                        </div>

                        {/* Contact Number */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-xs font-bold font-inter flex items-center gap-1">
                                {t('employee.contact') || "Contact Number"}<span className="text-red-500">*</span>
                            </label>
                            <ReusableInput
                                name="contact_number"
                                type="tel"
                                value={formData.contact_number}
                                onChange={handleChange}
                                placeholder="+1234567890"
                                backgroundColor="bg-gray-50"
                                border={errors.contact_number ? "border-red-500" : "border-gray-200"}
                                classes="h-12 rounded-xl text-sm"
                            />
                            {errors.contact_number && (
                                <p className="text-red-500 text-xs font-medium mt-1">{errors.contact_number}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-gray-700 text-xs font-bold font-inter flex items-center gap-1">
                                {t('table.email') || "Email"}<span className="text-red-500">*</span>
                            </label>
                            <ReusableInput
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={t('common.enter') || "Enter email"}
                                backgroundColor="bg-gray-50"
                                border={errors.email ? "border-red-500" : "border-gray-200"}
                                classes="h-12 rounded-xl text-sm"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs font-medium mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Expires At (Optional) */}
                        <div className="space-y-2">
                            <FlowbiteDatePicker
                                label={t('qrCode.expiresAt') || "Expires At (Optional)"}
                                value={formData.expires_at}
                                onChange={handleChange}
                                placeholder="Select expiration date"
                                className="h-12 rounded-xl bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting || isCreating || isUpdating}
                            className="w-full h-12 bg-[#22B3E8] hover:bg-[#1fa0d1] transition-colors rounded-xl shadow-lg shadow-sky-100 flex items-center justify-center gap-2 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <QrCode size={18} />
                            <span>
                                {isSubmitting || isCreating || isUpdating
                                    ? (t('common.saving') || "Saving...")
                                    : isEditMode
                                    ? (t('common.update') || "Update QR Code")
                                    : (t('qrCode.generateQrCode') || "Generate QR Code")}
                            </span>
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
                                {t('workplace.qrPreviewTitle') || "QR Code Preview"}
                            </h2>
                            <p className="text-gray-400 text-sm font-medium mt-1">
                                {t('workplace.qrPreviewDesc') || "Preview and download your QR code"}
                            </p>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="w-full aspect-square max-h-[300px] mx-auto bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-8 relative">
                        {qrCodeValue ? (
                            <div className="p-4 bg-white rounded-xl shadow-sm" ref={qrCodeCanvasRef}>
                                <QRCodeCanvas
                                    value={qrCodeValue}
                                    size={200}
                                    level={"H"}
                                    includeMargin={true}
                                    imageSettings={{
                                        excavate: false,
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                                    <QrCode className="text-gray-400" size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500 text-sm font-bold">
                                        {t('workplace.noQrCode') || "No QR Code Generated"}
                                    </p>
                                    <p className="text-gray-400 text-xs font-medium mt-1">
                                        {t('workplace.noQrCodeDesc') || "Select a workplace and click generate"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handleDownloadPNG}
                            disabled={!qrCodeValue}
                            className={`w-full h-11 transition-colors rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 ${!qrCodeValue ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#4285F4] hover:bg-blue-600'}`}
                        >
                            <ImageIcon size={16} />
                            {t('common.download') || "Download"} PNG
                        </button>
                        <button
                            type="button"
                            onClick={handleDownloadPDF}
                            disabled={!qrCodeValue}
                            className={`w-full h-11 border transition-colors rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${!qrCodeValue ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                            <FileText size={16} />
                            {t('common.download') || "Download"} PDF
                        </button>
                        <button
                            type="button"
                            disabled={!qrCodeValue}
                            onClick={handlePrint}
                            className={`w-full h-11 border transition-colors rounded-xl font-semibold text-sm flex items-center justify-center gap-2 ${!qrCodeValue ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Printer size={16} />
                            {t('qrCode.print') || "Print QR Code"}
                        </button>
                    </div>

                    {/* Quick Tip */}
                    <div className="mt-8 bg-[#E3F2FD] rounded-xl border border-[#BBDEFB] p-4 flex gap-3">
                        <div className="mt-0.5 shrink-0 text-[#1976D2]">
                            <Info size={16} />
                        </div>
                        <div>
                            <h4 className="text-[#0D47A1] text-xs font-bold font-inter">
                                {t('workplace.quickTip') || "Quick Tip"}
                            </h4>
                            <p className="text-[#1565C0] text-xs font-medium font-inter leading-relaxed mt-1">
                                {t('workplace.quickTipDesc') || "Print or download the QR code and place it at the workplace location for employees to scan."}
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default WorkPlaceQrForm;
