import React from "react";

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-gray-600 text-xs font-semibold mb-1">{title}</p>
            <h3 className="text-[#111827] text-2xl font-bold">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
            <Icon size={20} strokeWidth={2.5} />
        </div>
    </div>
);

export default StatCard;
