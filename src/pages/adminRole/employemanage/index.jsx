import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LuPlus } from "react-icons/lu";
import DashboardBanner from "../../../components/DashboardBanner";
import EmployeeReport from "./features/employeReport";
import AddEditEmployee from "./features/AddEditEmployee";
import EmployeeProfile from "./features/EmployeeProfile";

const EmployeeDashboard = () => {
  const { t } = useTranslation();
  const [view, setView] = useState("list"); // 'list', 'add', or 'profile'
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  if (view === "add") {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 overflow-x-hidden">
        <AddEditEmployee 
          onBack={() => {
            setView("list");
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
        />
      </div>
    );
  }

  if (view === "profile") {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6 overflow-x-hidden">
        <EmployeeProfile 
          onBack={() => {
            setView("list");
            setSelectedEmployee(null);
          }} 
          onEdit={(employee) => {
            setSelectedEmployee(employee);
            setView("add");
          }}
          employee={selectedEmployee}
        />
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
              title={t('employee.managementTitle')}
              description={t('employee.managementDesc')}
              rightContent={
                <div
                  onClick={() => {
                    setSelectedEmployee(null);
                    setView("add");
                  }}
                  className="bg-primary-500 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-primary-600 transition-colors"
                >
                  <LuPlus className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium whitespace-nowrap">
                    {t('employee.addBtn')}
                  </span>
                </div>
              }
            />
            <div className="rounded-[1.5rem]">
              <EmployeeReport 
                onViewProfile={(employee) => {
                  setSelectedEmployee(employee);
                  setView("profile");
                }}
                onEdit={(employee) => {
                  setSelectedEmployee(employee);
                  setView("add");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
