import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import DashboardBanner from "../../../components/DashboardBanner";
import EmployeeReport from "./features/employeReport";
import AddEditEmployee from "./features/AddEditEmployee";

const EmployeeDashboard = () => {
  const [view, setView] = useState("list"); // 'list' or 'add'

  if (view === "add") {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 overflow-x-hidden">
        <AddEditEmployee onBack={() => setView("list")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 overflow-x-hidden">
      <div className="space-y-6 max-w-full">
        {/* Top Section with Left and Right Columns */}
        <div className=" gap-6">
          {/* Left Column - Main Content */}
          <div className=" space-y-6">
            {/* Welcome Card */}
            <DashboardBanner
              title="Employee Management"
              description="Manage your team members and their information"
              rightContent={
                <div
                  onClick={() => setView("add")}
                  className="bg-primary-500 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-primary-600 transition-colors"
                >
                  <LuPlus className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium whitespace-nowrap">
                    Add Employee
                  </span>
                </div>
              }
            />
            <div className="rounded-[1.5rem]">
              <EmployeeReport />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
