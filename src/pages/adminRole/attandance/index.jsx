import React from "react";
import { LuRefreshCw } from "react-icons/lu";
import DashboardCardsContainer from "./features/dashboardCard";
import DashboardBanner from "../../../components/DashboardBanner";
import AttendanceReport from "./features/attandanceReport";

const AttendanceDashboard = () => {

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 overflow-x-hidden">
      <div className="space-y-6 max-w-full">
        {/* Top Section with Left and Right Columns */}
        <div className=" gap-6">
          {/* Left Column - Main Content */}
          <div className=" space-y-6">
            {/* Welcome Card */}
            <DashboardBanner
              title="Live Attendance View"
              description="Real-time attendance tracking"
              rightContent={
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-100">
                  <LuRefreshCw className="w-4 h-4 text-blue-600 animate-spin-slow" />
                  <span className="text-gray-900 text-sm font-medium whitespace-nowrap">
                    Auto-refresh in 30
                  </span>
                </div>
              }
            />
            <div className="rounded-[1.5rem]">
              <DashboardCardsContainer />
            </div>
            <div className="rounded-[1.5rem]">
              <AttendanceReport />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
