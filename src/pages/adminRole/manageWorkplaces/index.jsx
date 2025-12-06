import React, { useState } from "react";
import DashboardBanner from "../../../components/DashboardBanner";
import WorkPlaceForm from "./features/workPlaceForm";

const ManageWorkplaces = () => {

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 overflow-x-hidden">
      <div className="space-y-6 max-w-full">
        {/* Top Section with Left and Right Columns */}
        <div className=" gap-6">
          {/* Left Column - Main Content */}
          <div className=" space-y-6">
            {/* Welcome Card */}
            <DashboardBanner
              title="Generate Workplace QR Code"
              description="Create and download QR codes for workplace identification and tracking"
            />
            <div className="rounded-[1.5rem]">
              <WorkPlaceForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageWorkplaces;
