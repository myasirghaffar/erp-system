import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    Download,
    Printer,
    Building2,
    MapPin,
    Briefcase,
    Users,
    Phone,
    Mail,
    Edit,
    ArrowLeft
} from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';
import DashboardBanner from "../../../../components/DashboardBanner";

const QrCodeDetail = ({ data, onBack, onEdit }) => {
    const { t } = useTranslation();

    // Fallback data if none provided (Mock data kept for dev)
    const qrData = data || {
        id: "QR-8492",
        created: "Dec 15, 2024",
        status: "Active",
        companyName: "TechCorp Industries",
        location: "Building A, Floor 3",
        department: "Engineering",
        capacity: "50 Employees",
        contact: "+1 (555) 123-4567",
        email: "info@techcorp.com",
        qrValue: JSON.stringify({ id: "QR-8492", type: "workplace" })
    };

    const handleDownload = () => {
        const canvas = document.getElementById('detail-qr-canvas');
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `QR_${qrData.id}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    return (
        <div className="w-full space-y-6">
            <DashboardBanner
                title={t('qrCode.detailTitle')}
                description={t('qrCode.detailDesc')}
            />

            {/* Custom Back Link */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-medium text-sm w-fit"
            >
                <ArrowLeft size={16} />
                <span>{t('qrCode.backToCodes')}</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Left Column: QR Preview */}
                <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                    <div className="mb-4 text-center">
                        <h3 className="text-[#111827] font-bold text-lg">{t('qrCode.previewTitle')}</h3>
                        <p className="text-gray-400 text-sm font-medium">{t('qrCode.scanToTest')}</p>
                    </div>

                    <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-6 mb-8 border border-gray-100">
                        <div className="bg-white p-4 rounded-xl shadow-sm">
                            <QRCodeCanvas
                                id="detail-qr-canvas"
                                value={qrData.qrValue || "test"}
                                size={200}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>
                    </div>

                    <div className="w-full space-y-3">
                        <button
                            onClick={handleDownload}
                            className="w-full h-11 bg-[#22B3E8] hover:bg-[#1fa0d1] transition-colors rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                        >
                            <Download size={18} />
                            {t('common.download')}
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="w-full h-11 bg-white border border-gray-200 hover:bg-gray-50 transition-colors rounded-xl text-[#374151] font-bold text-sm flex items-center justify-center gap-2"
                        >
                            <Printer size={18} />
                            {t('common.print')}
                        </button>
                    </div>

                    <div className="w-full mt-8 pt-6 border-t border-gray-100 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">{t('qrCode.id')}</span>
                            <span className="text-gray-900 font-bold">#{qrData.id}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">{t('qrCode.createdDate')}</span>
                            <span className="text-gray-900 font-bold">{qrData.created}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">{t('map.status')}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${qrData.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                                }`}>
                                {qrData.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Workplace Info */}
                <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-[#111827] font-bold text-xl">{t('workplace.infoTitle')}</h3>
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-1.5 text-[#22B3E8] hover:text-[#1fa0d1] font-bold text-sm"
                        >
                            <Edit size={16} />
                            {t('common.edit')}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <InfoCard
                            icon={Building2}
                            iconColor="text-indigo-600"
                            iconBg="bg-indigo-50"
                            label={t('workplace.companyName')}
                            value={qrData.companyName}
                        />
                        {/* Location */}
                        <InfoCard
                            icon={MapPin}
                            iconColor="text-indigo-600"
                            iconBg="bg-indigo-50"
                            label={t('workplace.location')}
                            value={qrData.location}
                        />
                        {/* Department */}
                        <InfoCard
                            icon={Briefcase}
                            iconColor="text-[#22B3E8]"
                            iconBg="bg-sky-50"
                            label={t('employee.department')}
                            value={qrData.department}
                        />
                        {/* Capacity */}
                        <InfoCard
                            icon={Users}
                            iconColor="text-[#22B3E8]"
                            iconBg="bg-sky-50"
                            label={t('workplace.capacity')}
                            value={qrData.capacity}
                        />
                        {/* Contact */}
                        <InfoCard
                            icon={Phone}
                            iconColor="text-[#22B3E8]"
                            iconBg="bg-sky-50"
                            label={t('employee.contact')}
                            value={qrData.contact}
                        />
                        {/* Email */}
                        <InfoCard
                            icon={Mail}
                            iconColor="text-[#22B3E8]"
                            iconBg="bg-sky-50"
                            label={t('table.email')}
                            value={qrData.email}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for the info grid
const InfoCard = ({ icon: Icon, iconColor, iconBg, label, value }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors bg-white shadow-sm/50">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={iconColor} size={24} />
        </div>
        <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">{label}</span>
            <span className="text-[#111827] font-bold text-sm block">{value}</span>
        </div>
    </div>
);

export default QrCodeDetail;
