export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// export const BASE_URL = 'https://b0fd-139-135-36-92.ngrok-free.app'
export const BASE_URL_IMAGE = import.meta.env.VITE_FILES_URL;

const VERSION_API = "v1";

export const API_END_POINTS = {
  /////////////////////////////<=== AUTH ===>//////////////////////////////
  login: BASE_URL + "/api/auth/login",
  signup: BASE_URL + "/api/auth/register",
  forgetPassword: BASE_URL + "/api/auth/forgot-password",
  resetPassword: BASE_URL + "/api/auth/reset-password",
  updateUserProfile: BASE_URL + "/api/auth/profile",
  getUserProfile: BASE_URL + "/api/auth/profile",

  /////////////////////////////<=== DASHBOARD ===>//////////////////////////////
  getDashboardRealtime: BASE_URL + "/api/dashboard/realtime",
  getDashboardAnalytics: BASE_URL + "/api/dashboard/analytics",
  getEmployeeDashboard: BASE_URL + "/api/dashboard/employee",

  /////////////////////////////<=== ANALYTICS ===>////////////////////////////
  getAnalyticsCharts: BASE_URL + "/api/analytics/charts",
  getAnalyticsTrends: BASE_URL + "/api/analytics/trends",
  getAnalyticsSummary: BASE_URL + "/api/analytics/summary",

  /////////////////////////////<=== EMPLOYEES ===>/////////////////////////////
  getAllEmployees: BASE_URL + "/api/employees",
  getEmployeeById: (id) => BASE_URL + `/api/employees/${id}`,
  createEmployee: BASE_URL + "/api/employees",
  updateEmployee: (id) => BASE_URL + `/api/employees/${id}`,
  deleteEmployee: (id) => BASE_URL + `/api/employees/${id}`,
  changeEmployeeRole: (id) => BASE_URL + `/api/employees/${id}/role`,
  updateEmployeeStatus: (id) => BASE_URL + `/api/employees/${id}/status`,
  resetEmployeePassword: (id) => BASE_URL + `/api/employees/${id}/reset-password`,
  getEmployeeAttendanceHistory: (id) => BASE_URL + `/api/employees/${id}/attendance`,

  /////////////////////////////<=== ATTENDANCE ===>///////////////////////////
  scanQR: BASE_URL + "/api/attendance/scan",
  submitManualEntry: BASE_URL + "/api/attendance/manual",
  getAttendanceHistory: BASE_URL + "/api/attendance/history",
  getTodayAttendance: BASE_URL + "/api/attendance/today",
  getMonthlyHours: BASE_URL + "/api/attendance/monthly-hours",
  syncOfflineRecords: BASE_URL + "/api/attendance/sync-offline",
  getAttendanceLocations: BASE_URL + "/api/attendance/locations",
  getAdminAttendanceHistory: BASE_URL + "/api/attendance/admin-history",
  getMonthlyMetrics: BASE_URL + "/api/attendance/admin/monthly-metrics",
  deleteAttendance: (id) => BASE_URL + `/api/attendance/${id}`,
  exportMonthlyAttendance: BASE_URL + "/api/attendance/export/monthly",
  exportDateRangeAttendance: BASE_URL + "/api/attendance/export/range",
  exportEmployeeAttendance: BASE_URL + "/api/attendance/export/employee",
  exportWorkplaceAttendance: BASE_URL + "/api/attendance/export/workplace",

  /////////////////////////////<=== ATTENDANCE APPROVAL ===>//////////////////
  getPendingAttendanceRecords: BASE_URL + "/api/attendance-approval/pending",
  updateAttendanceRecordStatus: (id) => BASE_URL + `/api/attendance-approval/${id}/status`,
  editAttendanceRecord: (id) => BASE_URL + `/api/attendance-approval/${id}`,

  /////////////////////////////<=== WORKPLACES ===>///////////////////////////
  getAllWorkplaces: BASE_URL + "/api/workplaces",
  getWorkplaceById: (id) => BASE_URL + `/api/workplaces/${id}`,
  createWorkplace: BASE_URL + "/api/workplaces",
  createWorkplaceWithQRCode: BASE_URL + "/api/workplaces/with-qrcode",
  updateWorkplace: (id) => BASE_URL + `/api/workplaces/${id}`,
  deleteWorkplace: (id) => BASE_URL + `/api/workplaces/${id}`,

  /////////////////////////////<=== QR CODES ===>/////////////////////////////
  getAllQRCodes: BASE_URL + "/api/qrcodes",
  getQRCodeById: (id) => BASE_URL + `/api/qrcodes/${id}`,
  createQRCode: BASE_URL + "/api/qrcodes",
  updateQRCode: (id) => BASE_URL + `/api/qrcodes/${id}`,
  deleteQRCode: (id) => BASE_URL + `/api/qrcodes/${id}`,

  /////////////////////////////<=== LEAVE REQUESTS ===>///////////////////////
  getAllLeaveRequests: BASE_URL + "/api/leave-requests",
  getLeaveRequestById: (id) => BASE_URL + `/api/leave-requests/${id}`,
  createLeaveRequest: BASE_URL + "/api/leave-requests",
  updateLeaveRequestStatus: (id) => BASE_URL + `/api/leave-requests/${id}/status`,
  deleteLeaveRequest: (id) => BASE_URL + `/api/leave-requests/${id}`,
  getLeaveRequestStatistics: BASE_URL + "/api/leave-requests/statistics",

  /////////////////////////////<=== APP SETTINGS ===>/////////////////////////
  getAppSettings: BASE_URL + "/api/app-settings",
  updateAppSettings: BASE_URL + "/api/app-settings",
  getAppVersion: BASE_URL + "/api/app-settings/version",

  /////////////////////////////<=== COMPANY SETTINGS ===>/////////////////////
  getCompanySettings: BASE_URL + "/api/company-settings",
  updateCompanySettings: BASE_URL + "/api/company-settings",
  updateCompanyInfo: BASE_URL + "/api/company-settings/company-info",
  updateWorkingHours: BASE_URL + "/api/company-settings/working-hours",
  updateOvertimeRules: BASE_URL + "/api/company-settings/overtime-rules",
  uploadCompanyLogo: BASE_URL + "/api/company-settings/upload-logo",

  /////////////////////////////<=== ADMIN DASHBOARD (Legacy) ===>/////////////
  getAdminDashboardStats: BASE_URL + "/api/admin/stats",

  /////////////////////////////<=== ROLES ===>////////////////////////////////
  getRolesStatistics: BASE_URL + "/api/roles/statistics",

  /////////////////////////////<=== COMPANY DASHBOARD ===>///////////////////
  getCompanyDashboardStats: BASE_URL + "/api/company-owner/getCompanyStats",
  getCompanyDashboardIftaSummary:
    BASE_URL + "/api/company-owner/companyIftaSummary",
  getCompanyDashboardCriticalAlerts: BASE_URL + "/api/companies/criticalAlerts",

  /////////////////////////////<=== DRIVER DASHBOARD ===>////////////////////
  getDriverDashboardStats: BASE_URL + "/api/driver-dashboard/stats",
  getDriverDashboardStatus: BASE_URL + "/api/driver-dashboard/status",
  getDriverExpiringDocs: BASE_URL + "/api/driver-dashboard/expiring-documents",

  /////////////////////////////<=== NOTIFICATIONS ===>///////////////////////
  getAllNotifications: BASE_URL + "/api/notifications",
  getUnreadNotificationCount: BASE_URL + "/api/notifications/unread-count",
  markNotificationAsRead: (id) => BASE_URL + `/api/notifications/${id}/read`,
  markAllNotificationsAsRead: BASE_URL + "/api/notifications/read-all",
  deleteNotification: (id) => BASE_URL + `/api/notifications/${id}`,
};
