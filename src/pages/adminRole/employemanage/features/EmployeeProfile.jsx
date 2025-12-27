import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, UserCog, Edit, Calendar } from "lucide-react";
import DashboardBanner from "../../../../components/DashboardBanner";
import ReusableDataTable from "../../../../components/ReusableDataTable";
import ReusablePagination from "../../../../components/ReusablePagination";

const EmployeeProfile = ({ onBack, onEdit }) => {
  const { t } = useTranslation();
  // Mock Employee Data
  const employeeData = {
    name: "Sarah Johnson",
    status: "Active",
    id: "EMP-2024-0156",
    role: "Senior Software Engineer",
    department: "Engineering",
    manager: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  };

  // Mock Attendance Data
  const attendanceData = [
    { id: 1, date: "01.12.2024", day: "Friday", checkIn: "-", checkOut: "-", duration: "-", type: "Holiday", workplace: "-", note: "-" },
    { id: 2, date: "04.12.2024", day: "Monday", checkIn: "08:45 AM", checkOut: "05:00 PM", duration: "8h 15m", type: "QR Scan", workplace: "Headquarters", note: "On time" },
    { id: 3, date: "05.12.2024", day: "Tuesday", checkIn: "08:45 AM", checkOut: "05:00 PM", duration: "8h 15m", type: "QR Scan", workplace: "Headquarters", note: "On time" },
    { id: 4, date: "06.12.2024", day: "Wednesday", checkIn: "08:45 AM", checkOut: "05:00 PM", duration: "8h 15m", type: "QR Scan", workplace: "Headquarters", note: "On time" },
    { id: 5, date: "07.12.2024", day: "Thursday", checkIn: "08:45 AM", checkOut: "05:00 PM", duration: "8h 15m", type: "QR Scan", workplace: "Headquarters", note: "On time" },
    { id: 6, date: "08.12.2024", day: "Friday", checkIn: "08:45 AM", checkOut: "05:00 PM", duration: "8h 15m", type: "Manual", workplace: "Headquarters", note: "On time" },
    { id: 7, date: "09.12.2024", day: "Saturday", checkIn: "-", checkOut: "-", duration: "-", type: "Weekends", workplace: "-", note: "-" },
    { id: 8, date: "10.12.2024", day: "Sunday", checkIn: "-", checkOut: "-", duration: "-", type: "Weekends", workplace: "-", note: "-" },
    { id: 9, date: "11.12.2024", day: "Monday", checkIn: "08:45 AM", checkOut: "05:00 PM", duration: "8h 15m", type: "QR Scan", workplace: "Headquarters", note: "On time" },
  ];

  const columns = [
    {
      key: "date",
      label: t('table.date'),
      width: "140px",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[#111827] font-semibold text-[13px]">{row.date}</span>
          <span className="text-gray-400 text-[11px] font-medium">{row.day}</span>
        </div>
      )
    },
    {
      key: "checkIn",
      label: t('attendance.checkInTime'),
      width: "160px",
      render: (row) => (
        row.checkIn !== "-" ? (
          <div className="flex flex-col">
            <span className="text-[#111827] font-semibold text-[13px]">{row.checkIn}</span>
            <span className="text-gray-400 text-[11px] font-medium">Dec 24, 2024</span>
          </div>
        ) : <span className="text-gray-400">-</span>
      )
    },
    {
      key: "checkOut",
      label: t('attendance.checkOutTime'),
      width: "160px",
      render: (row) => (
        row.checkOut !== "-" ? (
          <div className="flex flex-col">
            <span className="text-[#111827] font-semibold text-[13px]">{row.checkOut}</span>
            <span className="text-gray-400 text-[11px] font-medium">Dec 24, 2024</span>
          </div>
        ) : <span className="text-gray-400">-</span>
      )
    },
    {
      key: "duration",
      label: t('attendance.duration'),
      width: "100px",
      render: (row) => <span className="text-[#111827] font-medium text-[13px]">{row.duration}</span>
    },
    {
      key: "type",
      label: t('attendance.eventType'),
      width: "140px",
      render: (row) => {
        let bgClass = "bg-gray-100 text-gray-500";
        if (row.type === "QR Scan") bgClass = "bg-green-50 text-green-600";
        if (row.type === "Manual") bgClass = "bg-blue-50 text-blue-600";
        if (row.type === "Holiday") bgClass = "bg-gray-200 text-gray-600";

        if (["Weekends", "Holiday"].includes(row.type)) {
          return <span className="text-gray-500 font-medium text-[13px]">{row.type}</span>;
        }

        return (
          <span className={`px-2.5 py-1 rounded text-[11px] font-semibold ${bgClass}`}>
            {row.type}
          </span>
        );
      }
    },
    {
      key: "workplace",
      label: t('workplace.title'),
      width: "140px",
      render: (row) => (
        row.workplace !== "-" ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[13px] font-medium">{row.workplace}</span>
          </div>
        ) : <span className="text-gray-400">-</span>
      )
    },
    {
      key: "note",
      label: t('attendance.managerNote'),
      render: (row) => <span className="text-[#111827] font-medium text-[13px]">{row.note}</span>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <DashboardBanner
        title={t('employee.profileTitle')}
        description={t('employee.visitProfile', { name: employeeData.name })}
        onBack={onBack}
        rightContent={
          <button className="flex items-center gap-2 bg-white text-[#111827] px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 transition-colors">
            {t('common.exportExcel')}
            <Download size={16} />
          </button>
        }
      />

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
        <img
          src={employeeData.avatar}
          alt={employeeData.name}
          className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md shadow-gray-200"
        />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#111827]">{employeeData.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[11px] font-bold uppercase tracking-wide">
                {employeeData.status}
              </span>
            </div>
            <div className="text-xs text-gray-500 font-medium">{t('employee.id')}</div>
            <div className="text-sm font-semibold text-[#111827]">{employeeData.id}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-gray-500 font-medium">{t('table.role')}</div>
            <div className="text-sm font-semibold text-[#111827]">{employeeData.role}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-gray-500 font-medium">{t('employee.department')}</div>
            <div className="text-sm font-semibold text-[#111827]">{employeeData.department}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-gray-500 font-medium">{t('employee.manager')}</div>
            <div className="text-sm font-semibold text-[#111827]">{employeeData.manager}</div>
          </div>
        </div>
      </div>

      {/* Attendance History Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#111827]">{t('attendance.historyTitle')}</h3>
            <p className="text-gray-400 text-sm mt-1">{t('attendance.historyDesc')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-[#111827]">{t('common.selectMonth')}</span>
            <select className="border-gray-200 border rounded-lg text-sm text-gray-600 font-medium py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
              <option>December 2024</option>
              <option>November 2024</option>
            </select>
          </div>
        </div>

        <div className="w-full">
          <ReusableDataTable columns={columns} data={attendanceData} />
        </div>

        {/* Pagination placeholder if needed, though data is small */}
        <div className="border-t border-gray-100">
          <ReusablePagination
            totalItems={attendanceData.length}
            itemsPerPage={10}
            currentPage={1}
            onPageChange={() => { }}
            totalPages={1}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
        >
          <UserCog size={18} />
          {t('employee.assignRoles')}
        </button>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22B3E8] text-white font-semibold hover:bg-[#1fa0d1] transition-colors shadow-sm"
        >
          <Edit size={18} />
          {t('employee.editBtn')}
        </button>
      </div>

    </div>
  );
};

export default EmployeeProfile;
