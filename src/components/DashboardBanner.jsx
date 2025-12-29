import React from "react";
import RectangleBanner from "../assets/images/rectanglebanner.png";
import { ArrowLeft } from "lucide-react";

const DashboardBanner = ({ title, description, rightContent, onBack }) => {
    return (
        <div className="w-full relative rounded-[10px] overflow-hidden min-h-[12rem] flex items-center mt-4">
            <img
                className="w-full h-full object-cover absolute inset-0"
                src={RectangleBanner}
                alt="Dashboard Banner"
            />
            <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply" />

            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
                <div className="flex items-center gap-6">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <div className="flex flex-col justify-center">
                        <div className="text-gray-50 text-xl md:text-3xl font-bold font-inter leading-tight mb-2">
                            {title}
                        </div>
                        <div className="text-gray-50 text-base md:text-xl font-normal font-inter leading-snug">
                            {description}
                        </div>
                    </div>
                </div>
                {rightContent && (
                    <div className="flex-shrink-0">
                        {rightContent}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardBanner;
