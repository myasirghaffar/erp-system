import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Download, UserCog, Edit, Calendar } from "lucide-react";
import DashboardBanner from "../../../../components/DashboardBanner";
import ReusableDataTable from "../../../../components/ReusableDataTable";
import ReusablePagination from "../../../../components/ReusablePagination";
import {
  useGetEmployeeByIdQuery,
  useGetEmployeeAttendanceHistoryQuery,
} from "../../../../services/Api";
import { toast } from "react-toastify";

const EmployeeProfile = ({ onBack, onEdit, employee }) => {
  const { t } = useTranslation();
  const [attendancePage, setAttendancePage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const itemsPerPage = 10;

  // Get employee ID from prop
  const employeeId = employee?.id;

  // Fetch employee details
  const {
    data: employeeDataResponse,
    isLoading: isLoadingEmployee,
    error: employeeError,
  } = useGetEmployeeByIdQuery(employeeId, {
    skip: !employeeId,
  });

  // Calculate date range for selected month
  const monthStart = useMemo(() => {
    const date = new Date(selectedMonth + "-01");
    return date.toISOString().split("T")[0];
  }, [selectedMonth]);

  const monthEnd = useMemo(() => {
    const date = new Date(selectedMonth + "-01");
    date.setMonth(date.getMonth() + 1);
    date.setDate(0); // Last day of the month
    return date.toISOString().split("T")[0];
  }, [selectedMonth]);

  // Fetch attendance history
  const {
    data: attendanceResponse,
    isLoading: isLoadingAttendance,
    error: attendanceError,
  } = useGetEmployeeAttendanceHistoryQuery(
    {
      id: employeeId,
      page: attendancePage,
      limit: itemsPerPage,
      start_date: monthStart,
      end_date: monthEnd,
    },
    {
      skip: !employeeId,
    }
  );

  // Transform employee data
  const employeeData = useMemo(() => {
    if (!employeeDataResponse?.data?.employee) return null;

    const emp = employeeDataResponse.data.employee;

    return {
      name: emp.full_name || "Unknown",
      status: emp.status === "active" ? "Active" : "Inactive",
      id: `EMP-${String(emp.id).padStart(4, "0")}`,
      role: emp.position || emp.role || "Employee",
      department: emp.department || "-",
      manager: emp.manager || "-",
      avatar: emp.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.full_name || "User")}&background=4FC3F7&color=fff&size=128`,
      email: emp.email || "",
      phone: emp.phone_number || "",
      fullData: emp,
    };
  }, [employeeDataResponse]);

  // Transform attendance records into table format
  const attendanceData = useMemo(() => {
    if (!attendanceResponse?.data?.records) return [];

    const records = attendanceResponse.data.records;
    const attendanceMap = new Map();

    // Group records by date and pair clock_in with clock_out
    records.forEach((record) => {
      const date = new Date(record.scan_time || record.date);
      const dateKey = date.toISOString().split("T")[0];
      const dateStr = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      if (!attendanceMap.has(dateKey)) {
        attendanceMap.set(dateKey, {
          date: dateStr,
          day: dayName,
          checkIn: null,
          checkOut: null,
          checkInRecord: null,
          checkOutRecord: null,
          workplace: record.workplace?.name || "-",
          type: record.is_manual ? "Manual" : "QR Scan",
          note: record.notes || record.validation_message || "-",
        });
      }

      const dayData = attendanceMap.get(dateKey);
      const timeStr = new Date(record.scan_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      if (record.type === "clock_in") {
        dayData.checkIn = timeStr;
        dayData.checkInRecord = record;
        if (!dayData.workplace || dayData.workplace === "-") {
          dayData.workplace = record.workplace?.name || "-";
        }
      } else if (record.type === "clock_out") {
        dayData.checkOut = timeStr;
        dayData.checkOutRecord = record;
      }

      // Update type if manual
      if (record.is_manual) {
        dayData.type = "Manual";
      }
    });

    // Calculate duration and format data
    const formattedData = Array.from(attendanceMap.values())
      .map((dayData, index) => {
        let duration = "-";
        if (dayData.checkIn && dayData.checkOut) {
          const checkInTime = new Date(dayData.checkInRecord.scan_time);
          const checkOutTime = new Date(dayData.checkOutRecord.scan_time);
          const diffMs = checkOutTime - checkInTime;
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          duration = `${hours}h ${minutes}m`;
        }

        return {
          id: index + 1,
          date: dayData.date,
          day: dayData.day,
          checkIn: dayData.checkIn || "-",
          checkOut: dayData.checkOut || "-",
          duration,
          type: dayData.type,
          workplace: dayData.workplace,
          note: dayData.note,
        };
      })
      .sort((a, b) => {
        // Sort by date descending
        const dateA = new Date(a.date.split(".").reverse().join("-"));
        const dateB = new Date(b.date.split(".").reverse().join("-"));
        return dateB - dateA;
      });

    return formattedData;
  }, [attendanceResponse]);

  // Handle errors
  useEffect(() => {
    if (employeeError) {
      toast.error(employeeError?.data?.message || "Failed to load employee data");
    }
    if (attendanceError) {
      toast.error(attendanceError?.data?.message || "Failed to load attendance data");
    }
  }, [employeeError, attendanceError]);

  // Reset page when month changes
  useEffect(() => {
    setAttendancePage(1);
  }, [selectedMonth]);

  // Loading state
  if (isLoadingEmployee) {
    return (
      <div className="space-y-6">
        <DashboardBanner
          title={t("employee.profileTitle")}
          description="Loading employee profile..."
          onBack={onBack}
        />
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-gray-500">Loading employee data...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (employeeError || !employeeData) {
    return (
      <div className="space-y-6">
        <DashboardBanner
          title={t("employee.profileTitle")}
          description="Error loading employee profile"
          onBack={onBack}
        />
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-red-500 mb-4">
            {employeeError?.data?.message || "Employee not found"}
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
            <span className="text-gray-400 text-[11px] font-medium">{row.date}</span>
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
            <span className="text-gray-400 text-[11px] font-medium">{row.date}</span>
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
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border-gray-200 border rounded-lg text-sm text-gray-600 font-medium py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="w-full">
          {isLoadingAttendance ? (
            <div className="p-8 text-center text-gray-500">Loading attendance data...</div>
          ) : attendanceError ? (
            <div className="p-8 text-center text-red-500">
              {attendanceError?.data?.message || "Failed to load attendance data"}
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No attendance records found for this month</div>
          ) : (
          <ReusableDataTable columns={columns} data={attendanceData} />
          )}
        </div>

        {/* Pagination */}
        {attendanceResponse?.data?.pagination && (
        <div className="border-t border-gray-100">
          <ReusablePagination
              totalItems={attendanceResponse.data.pagination.total}
              itemsPerPage={itemsPerPage}
              currentPage={attendancePage}
              onPageChange={setAttendancePage}
              totalPages={attendanceResponse.data.pagination.pages}
          />
        </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={() => onEdit && onEdit(employeeData.fullData)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
        >
          <UserCog size={18} />
          {t('employee.assignRoles')}
        </button>
        <button
          onClick={() => onEdit && onEdit(employeeData.fullData)}
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
