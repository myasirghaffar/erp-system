import React, { useEffect } from "react";
import { AlertTriangle, CheckCircle, XCircle, X } from "lucide-react";

const ICONS = {
    warning: <AlertTriangle className="text-amber-500 w-12 h-12" />,
    success: <CheckCircle className="text-green-500 w-12 h-12" />,
    error: <XCircle className="text-red-500 w-12 h-12" />,
};

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    loading,
    title = "Confirm Action",
    message,
    icon = "warning",
    confirmText = "Yes, delete it!",
    cancelText = "Cancel",
    confirmColor = "bg-red-600 hover:bg-red-700",
    cancelColor = "bg-gray-100 hover:bg-gray-200",
    confirmTextColor = "text-white",
    cancelTextColor = "text-gray-700",
}) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape" && open && !loading) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [open, loading, onClose]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [open]);

    if (!open) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon */}
                        <div className={`mb-4 p-3 rounded-full ${
                            icon === "warning" ? "bg-amber-50" : 
                            icon === "success" ? "bg-green-50" : 
                            "bg-red-50"
                        }`}>
                            {ICONS[icon]}
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-gray-900 mb-2 font-inter">
                            {title}
                        </h2>

                        {/* Message */}
                        <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6 font-inter">
                            {message}
                        </p>

                        {/* Actions */}
                        <div className="flex justify-center gap-3 w-full">
                            <button
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${cancelColor} ${cancelTextColor}`}
                                onClick={onClose}
                                disabled={loading}
                            >
                                {cancelText}
                            </button>
                            <button
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md ${confirmColor} ${confirmTextColor}`}
                                onClick={onConfirm}
                                disabled={loading}
                            >
                                {loading && (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                )}
                                {loading ? "Deleting..." : confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;