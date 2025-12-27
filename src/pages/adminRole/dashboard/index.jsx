import React, { useState } from "react";
import DashboardCardsContainer from "./features/dashboardCard";
import DashboardBanner from "../../../components/DashboardBanner";
import ReportExport from "./features/reportExport";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 overflow-x-hidden">
      <div className="space-y-6 max-w-full">
        {/* Top Section with Left and Right Columns */}
        <div className=" gap-6">
          {/* Left Column - Main Content */}
          <div className=" space-y-6">
            {/* Welcome Card */}
            <DashboardBanner
              title={t('dashboard.title')}
              description={t('dashboard.welcomeDesc')}
            />
            <div className="rounded-[1.5rem]">
              <DashboardCardsContainer />
            </div>
            <div className="rounded-[1.5rem]">
              <ReportExport />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
