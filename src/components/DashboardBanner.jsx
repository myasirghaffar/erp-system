import React from "react";
import RectangleBanner from "../assets/images/rectanglebanner.png";

const DashboardBanner = ({ title, description }) => {
    return (
        <div className="w-full relative rounded-[10px] overflow-hidden min-h-[12rem]">
            <img
                className="w-full h-full object-cover absolute inset-0"
                src={RectangleBanner}
                alt="Dashboard Banner"
            />
            <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply" />

            <div className="relative z-10 p-6 md:p-10 flex flex-col justify-center h-full min-h-[12rem]">
                <div className="text-gray-50 text-2xl md:text-3xl font-bold font-inter leading-tight mb-2">
                    {title}
                </div>
                <div className="text-gray-50 text-base md:text-xl font-normal font-inter leading-snug">
                    {description}
                </div>
            </div>
        </div>
    );
};

export default DashboardBanner;
