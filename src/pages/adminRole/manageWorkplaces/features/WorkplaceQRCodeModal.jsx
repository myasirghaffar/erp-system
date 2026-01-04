import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { X, Download, Eye, QrCode } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from "react-toastify";

const WorkplaceQRCodeModal = ({ isOpen, onClose, qrCodeData, workplaceName }) => {
    const { t } = useTranslation();
    const qrCodeCanvasRef = useRef(null);

    if (!isOpen) return null;

    const handleDownload = () => {
        if (!qrCodeData?.code) {
            toast.error(t('qrCode.noQrCodeToDownload') || "No QR code available to download");
            return;
        }

        try {
            const canvas = qrCodeCanvasRef.current?.querySelector('canvas');
            if (canvas) {
                const pngUrl = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `QR_${workplaceName || qrCodeData.id || 'code'}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                toast.success(t('qrCode.downloadSuccess') || "QR code downloaded successfully");
            } else {
                toast.error(t('qrCode.canvasNotFound') || "QR code canvas not found");
            }
        } catch (error) {
            console.error('Download error:', error);
            toast.error(t('qrCode.downloadError') || "Failed to download QR code");
        }
    };

    const qrValue = qrCodeData?.code || qrCodeData?.secure_code || "";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <QrCode className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {t('qrCode.title') || "QR Code"}
                            </h2>
                            {workplaceName && (
                                <p className="text-sm text-gray-500">{workplaceName}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {qrValue ? (
                        <>
                            <div className="flex flex-col items-center mb-6">
                                <div className="mb-4 text-center">
                                    <p className="text-sm text-gray-600 mb-2">
                                        {t('qrCode.scanToTest') || "Scan this QR code to test"}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200" ref={qrCodeCanvasRef}>
                                    <QRCodeCanvas
                                        value={qrValue}
                                        size={200}
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                </div>
                            </div>

                            {/* QR Code Info */}
                            {qrCodeData && (
                                <div className="mb-6 space-y-2 p-4 bg-gray-50 rounded-lg">
                                    {qrCodeData.company_name && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 font-medium">
                                                {t('workplace.companyName') || "Company"}:
                                            </span>
                                            <span className="text-gray-900 font-semibold">
                                                {qrCodeData.company_name}
                                            </span>
                                        </div>
                                    )}
                                    {qrCodeData.department && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 font-medium">
                                                {t('employee.department') || "Department"}:
                                            </span>
                                            <span className="text-gray-900 font-semibold">
                                                {qrCodeData.department}
                                            </span>
                                        </div>
                                    )}
                                    {qrCodeData.status && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 font-medium">
                                                {t('map.status') || "Status"}:
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                    qrCodeData.status === "active"
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {qrCodeData.status === "active"
                                                    ? t('employee.active') || "Active"
                                                    : t('employee.inactive') || "Inactive"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDownload}
                                    className="flex-1 h-11 bg-[#22B3E8] hover:bg-[#1fa0d1] transition-colors rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                                >
                                    <Download size={18} />
                                    {t('common.download') || "Download"}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 h-11 bg-white border border-gray-200 hover:bg-gray-50 transition-colors rounded-xl text-gray-700 font-semibold text-sm flex items-center justify-center gap-2"
                                >
                                    <Eye size={18} />
                                    {t('common.close') || "Close"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">
                                {t('workplace.noQrCode') || "No QR Code Available"}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                {t('workplace.noQrCodeDesc') || "This workplace doesn't have a QR code yet"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkplaceQRCodeModal;

