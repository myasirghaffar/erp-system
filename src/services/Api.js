import { API_END_POINTS } from "./ApiEndpoints";
import { SplitApiSettings } from "./SplitApiSetting";

export const api = SplitApiSettings.injectEndpoints({
  reducerPath: "api",
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    /////////////////////////////<===AUTH MUTATIONS===>//////////////////////////////
    login: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.login,
        method: "POST",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.signup,
        method: "POST",
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.forgetPassword,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.resetPassword,
        method: "POST",
        body: data,
      }),
    }),
    updateUserProfile: builder.mutation({
      query: ({ data }) => ({
        url: `${API_END_POINTS.updateUserProfile}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'UpdateUserList', id: 'user' }],
    }),

    /////////////////////////////<===AUTH QUERIES===>////////////////////////////////
    getUserProfile: builder.query({
      query: () => {
        return {
          url: `${API_END_POINTS.getUserProfile}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "UpdateUserList", id: "user" }],
    }),

    /////////////////////////////<===DASHBOARD QUERIES===>//////////////////////////
    getDashboardRealtime: builder.query({
      query: () => ({
        url: API_END_POINTS.getDashboardRealtime,
        method: "GET",
      }),
      providesTags: [{ type: "Dashboard", id: "realtime" }],
    }),
    getDashboardAnalytics: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: API_END_POINTS.getDashboardAnalytics,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: [{ type: "Dashboard", id: "analytics" }],
    }),
    getEmployeeDashboard: builder.query({
      query: () => ({
        url: API_END_POINTS.getEmployeeDashboard,
        method: "GET",
      }),
      providesTags: [{ type: "Dashboard", id: "employee" }],
    }),

    /////////////////////////////<===ANALYTICS QUERIES===>/////////////////////////
    getAnalyticsCharts: builder.query({
      query: ({ start_date, end_date } = {}) => ({
        url: API_END_POINTS.getAnalyticsCharts,
        method: "GET",
        params: { start_date, end_date },
      }),
      providesTags: [{ type: "Analytics", id: "charts" }],
    }),
    getAnalyticsTrends: builder.query({
      query: ({ start_date, end_date } = {}) => ({
        url: API_END_POINTS.getAnalyticsTrends,
        method: "GET",
        params: { start_date, end_date },
      }),
      providesTags: [{ type: "Analytics", id: "trends" }],
    }),
    getAnalyticsSummary: builder.query({
      query: ({ start_date, end_date } = {}) => ({
        url: API_END_POINTS.getAnalyticsSummary,
        method: "GET",
        params: { start_date, end_date },
      }),
      providesTags: [{ type: "Analytics", id: "summary" }],
    }),

    /////////////////////////////<===EMPLOYEES QUERIES===>//////////////////////////
    getAllEmployees: builder.query({
      query: ({ page = 1, limit = 10, search, status, role } = {}) => ({
        url: API_END_POINTS.getAllEmployees,
        method: "GET",
        params: { page, limit, search, status, role },
      }),
      providesTags: [{ type: "Employees", id: "list" }],
    }),
    getEmployeeById: builder.query({
      query: (id) => ({
        url: API_END_POINTS.getEmployeeById(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Employees", id }],
    }),
    getEmployeeAttendanceHistory: builder.query({
      query: ({ id, page = 1, limit = 10, start_date, end_date } = {}) => {
        const offset = (page - 1) * limit;
        return {
          url: API_END_POINTS.getEmployeeAttendanceHistory(id),
          method: "GET",
          params: { offset, limit, start_date, end_date },
        };
      },
      providesTags: (result, error, { id }) => [{ type: "EmployeeAttendance", id }],
    }),

    /////////////////////////////<===EMPLOYEES MUTATIONS===>///////////////////////
    createEmployee: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.createEmployee,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Employees", id: "list" }],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, data }) => ({
        url: API_END_POINTS.updateEmployee(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Employees", id },
        { type: "Employees", id: "list" },
      ],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: API_END_POINTS.deleteEmployee(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Employees", id: "list" }],
    }),
    changeEmployeeRole: builder.mutation({
      query: ({ id, data }) => ({
        url: API_END_POINTS.changeEmployeeRole(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Employees", id },
        { type: "Employees", id: "list" },
      ],
    }),
    updateEmployeeStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: API_END_POINTS.updateEmployeeStatus(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Employees", id },
        { type: "Employees", id: "list" },
      ],
    }),
    resetEmployeePassword: builder.mutation({
      query: ({ id, data }) => ({
        url: API_END_POINTS.resetEmployeePassword(id),
        method: "POST",
        body: data,
      }),
    }),

    /////////////////////////////<===ATTENDANCE QUERIES===>/////////////////////////
    getAttendanceHistory: builder.query({
      query: ({ page = 1, limit = 10, start_date, end_date, employee_id, workplace_id } = {}) => ({
        url: API_END_POINTS.getAttendanceHistory,
        method: "GET",
        params: { page, limit, start_date, end_date, employee_id, workplace_id },
      }),
      providesTags: [{ type: "Attendance", id: "history" }],
    }),
    getTodayAttendance: builder.query({
      query: () => ({
        url: API_END_POINTS.getTodayAttendance,
        method: "GET",
      }),
      providesTags: [{ type: "Attendance", id: "today" }],
    }),
    getMonthlyHours: builder.query({
      query: ({ month, year } = {}) => ({
        url: API_END_POINTS.getMonthlyHours,
        method: "GET",
        params: { month, year },
      }),
      providesTags: [{ type: "Attendance", id: "monthly" }],
    }),
    getAdminAttendanceHistory: builder.query({
      query: ({ page = 1, limit = 10, start_date, end_date, employee_name, workplace_name, is_manual } = {}) => {
        const params = { page, limit };
        if (start_date) params.start_date = start_date;
        if (end_date) params.end_date = end_date;
        if (employee_name) params.employee_name = employee_name;
        if (workplace_name) params.workplace_name = workplace_name;
        if (is_manual !== undefined) params.is_manual = is_manual;
        return {
          url: API_END_POINTS.getAdminAttendanceHistory,
          method: "GET",
          params,
        };
      },
      providesTags: [{ type: "Attendance", id: "admin-history" }],
    }),
    getMonthlyMetrics: builder.query({
      query: ({ month, year } = {}) => ({
        url: API_END_POINTS.getMonthlyMetrics,
        method: "GET",
        params: { month, year },
      }),
      providesTags: [{ type: "Attendance", id: "metrics" }],
    }),
    getAttendanceLocations: builder.query({
      query: ({ start_date, end_date } = {}) => ({
        url: API_END_POINTS.getAttendanceLocations,
        method: "GET",
        params: { start_date, end_date },
      }),
      providesTags: [{ type: "Attendance", id: "locations" }],
    }),

    /////////////////////////////<===ATTENDANCE MUTATIONS===>///////////////////////
    scanQR: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.scanQR,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Attendance", id: "today" },
        { type: "Attendance", id: "history" },
        { type: "Attendance", id: "admin-history" },
      ],
    }),
    submitManualEntry: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.submitManualEntry,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Attendance", id: "today" },
        { type: "Attendance", id: "history" },
        { type: "Attendance", id: "admin-history" },
      ],
    }),
    syncOfflineRecords: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.syncOfflineRecords,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Attendance", id: "today" },
        { type: "Attendance", id: "history" },
      ],
    }),
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: API_END_POINTS.deleteAttendance(id),
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Attendance", id: "history" },
        { type: "Attendance", id: "admin-history" },
      ],
    }),

    /////////////////////////////<===ATTENDANCE APPROVAL QUERIES===>///////////////
    getPendingAttendanceRecords: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: API_END_POINTS.getPendingAttendanceRecords,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: [{ type: "AttendanceApproval", id: "pending" }],
    }),

    /////////////////////////////<===ATTENDANCE APPROVAL MUTATIONS===>/////////////
    updateAttendanceRecordStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: API_END_POINTS.updateAttendanceRecordStatus(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [
        { type: "AttendanceApproval", id: "pending" },
        { type: "Attendance", id: "admin-history" },
      ],
    }),
    editAttendanceRecord: builder.mutation({
      query: ({ id, data }) => ({
        url: API_END_POINTS.editAttendanceRecord(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [
        { type: "AttendanceApproval", id: "pending" },
        { type: "Attendance", id: "admin-history" },
      ],
    }),

    /////////////////////////////<===WORKPLACES QUERIES===>////////////////////////
    getAllWorkplaces: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        search, 
        status, 
        location,
        name,
        description,
        geofence_radius_min,
        geofence_radius_max,
        created_from,
        created_to,
        updated_from,
        updated_to,
        date_range,
        date_range_field,
        has_qrcode,
        sort_by,
        sort_order
      } = {}) => {
        const params = { page, limit };
        if (search) params.search = search;
        if (status) params.status = status;
        if (location) params.location = location;
        if (name) params.name = name;
        if (description) params.description = description;
        if (geofence_radius_min) params.geofence_radius_min = geofence_radius_min;
        if (geofence_radius_max) params.geofence_radius_max = geofence_radius_max;
        if (created_from) params.created_from = created_from;
        if (created_to) params.created_to = created_to;
        if (updated_from) params.updated_from = updated_from;
        if (updated_to) params.updated_to = updated_to;
        if (date_range) params.date_range = date_range;
        if (date_range_field) params.date_range_field = date_range_field;
        if (has_qrcode !== undefined) params.has_qrcode = has_qrcode;
        if (sort_by) params.sort_by = sort_by;
        if (sort_order) params.sort_order = sort_order;
        return {
          url: API_END_POINTS.getAllWorkplaces,
          method: "GET",
          params,
        };
      },
      providesTags: [{ type: "Workplaces", id: "list" }],
    }),
    getWorkplaceById: builder.query({
      query: (id) => ({
        url: API_END_POINTS.getWorkplaceById(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Workplaces", id }],
    }),

    /////////////////////////////<===WORKPLACES MUTATIONS===>//////////////////////
    createWorkplace: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.createWorkplace,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Workplaces", id: "list" }],
    }),
    createWorkplaceWithQRCode: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.createWorkplaceWithQRCode,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Workplaces", id: "list" },
        { type: "QRCodes", id: "list" },
      ],
    }),
    updateWorkplace: builder.mutation({
      query: ({ id, data }) => ({
        url: API_END_POINTS.updateWorkplace(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Workplaces", id },
        { type: "Workplaces", id: "list" },
      ],
    }),
    deleteWorkplace: builder.mutation({
      query: (id) => ({
        url: API_END_POINTS.deleteWorkplace(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Workplaces", id: "list" }],
    }),

    /////////////////////////////<===QR CODES QUERIES===>//////////////////////////
    getAllQRCodes: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        workplace_id, 
        status,
        search,
        company_name,
        department,
        email,
        contact_number,
        workplace_name,
        expires_from,
        expires_to,
        expired,
        created_from,
        created_to,
        updated_from,
        updated_to,
        date_range,
        date_range_field,
        sort_by,
        sort_order
      } = {}) => {
        const params = { page, limit };
        if (workplace_id) params.workplace_id = workplace_id;
        if (status) params.status = status;
        if (search) params.search = search;
        if (company_name) params.company_name = company_name;
        if (department) params.department = department;
        if (email) params.email = email;
        if (contact_number) params.contact_number = contact_number;
        if (workplace_name) params.workplace_name = workplace_name;
        if (expires_from) params.expires_from = expires_from;
        if (expires_to) params.expires_to = expires_to;
        if (expired !== undefined) params.expired = expired;
        if (created_from) params.created_from = created_from;
        if (created_to) params.created_to = created_to;
        if (updated_from) params.updated_from = updated_from;
        if (updated_to) params.updated_to = updated_to;
        if (date_range) params.date_range = date_range;
        if (date_range_field) params.date_range_field = date_range_field;
        if (sort_by) params.sort_by = sort_by;
        if (sort_order) params.sort_order = sort_order;
        return {
          url: API_END_POINTS.getAllQRCodes,
          method: "GET",
          params,
        };
      },
      providesTags: [{ type: "QRCodes", id: "list" }],
    }),
    getQRCodeById: builder.query({
      query: (id) => ({
        url: API_END_POINTS.getQRCodeById(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "QRCodes", id }],
    }),

    /////////////////////////////<===QR CODES MUTATIONS===>////////////////////////
    createQRCode: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.createQRCode,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "QRCodes", id: "list" }],
    }),
    updateQRCode: builder.mutation({
      query: ({ id, data }) => ({
        url: API_END_POINTS.updateQRCode(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "QRCodes", id },
        { type: "QRCodes", id: "list" },
      ],
    }),
    deleteQRCode: builder.mutation({
      query: (id) => ({
        url: API_END_POINTS.deleteQRCode(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "QRCodes", id: "list" }],
    }),

    /////////////////////////////<===LEAVE REQUESTS QUERIES===>///////////////////
    getAllLeaveRequests: builder.query({
      query: ({ page = 1, limit = 10, status, employee_id, type } = {}) => ({
        url: API_END_POINTS.getAllLeaveRequests,
        method: "GET",
        params: { page, limit, status, employee_id, type },
      }),
      providesTags: [{ type: "LeaveRequests", id: "list" }],
    }),
    getLeaveRequestById: builder.query({
      query: (id) => ({
        url: API_END_POINTS.getLeaveRequestById(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "LeaveRequests", id }],
    }),
    getLeaveRequestStatistics: builder.query({
      query: () => ({
        url: API_END_POINTS.getLeaveRequestStatistics,
        method: "GET",
      }),
      providesTags: [{ type: "LeaveRequests", id: "statistics" }],
    }),

    /////////////////////////////<===LEAVE REQUESTS MUTATIONS===>//////////////////
    createLeaveRequest: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.createLeaveRequest,
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: [
        { type: "LeaveRequests", id: "list" },
        { type: "LeaveRequests", id: "statistics" },
      ],
    }),
    updateLeaveRequestStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: API_END_POINTS.updateLeaveRequestStatus(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "LeaveRequests", id },
        { type: "LeaveRequests", id: "list" },
        { type: "LeaveRequests", id: "statistics" },
      ],
    }),
    deleteLeaveRequest: builder.mutation({
      query: (id) => ({
        url: API_END_POINTS.deleteLeaveRequest(id),
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "LeaveRequests", id: "list" }],
    }),

    /////////////////////////////<===APP SETTINGS QUERIES===>//////////////////////
    getAppSettings: builder.query({
      query: () => ({
        url: API_END_POINTS.getAppSettings,
        method: "GET",
      }),
      providesTags: [{ type: "AppSettings", id: "current" }],
    }),
    getAppVersion: builder.query({
      query: () => ({
        url: API_END_POINTS.getAppVersion,
        method: "GET",
      }),
      providesTags: [{ type: "AppSettings", id: "version" }],
    }),

    /////////////////////////////<===APP SETTINGS MUTATIONS===>////////////////////
    updateAppSettings: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.updateAppSettings,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "AppSettings", id: "current" }],
    }),

    /////////////////////////////<===COMPANY SETTINGS QUERIES===>/////////////////
    getCompanySettings: builder.query({
      query: () => ({
        url: API_END_POINTS.getCompanySettings,
        method: "GET",
      }),
      providesTags: [{ type: "CompanySettings", id: "current" }],
    }),

    /////////////////////////////<===COMPANY SETTINGS MUTATIONS===>///////////////
    updateCompanySettings: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.updateCompanySettings,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "CompanySettings", id: "current" }],
    }),
    updateCompanyInfo: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.updateCompanyInfo,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "CompanySettings", id: "current" }],
    }),
    updateWorkingHours: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.updateWorkingHours,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "CompanySettings", id: "current" }],
    }),
    updateOvertimeRules: builder.mutation({
      query: ({ data }) => ({
        url: API_END_POINTS.updateOvertimeRules,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "CompanySettings", id: "current" }],
    }),
    uploadCompanyLogo: builder.mutation({
      query: (formData) => ({
        url: API_END_POINTS.uploadCompanyLogo,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "CompanySettings", id: "current" }],
    }),

    /////////////////////////////<===NOTIFICATIONS QUERIES===>/////////////////////
    getAllNotifications: builder.query({
      query: ({ page = 1, limit = 20, is_read, type } = {}) => ({
        url: API_END_POINTS.getAllNotifications,
        method: "GET",
        params: { page, limit, is_read, type },
      }),
      providesTags: [{ type: "Notifications", id: "list" }],
    }),
    getUnreadNotificationCount: builder.query({
      query: () => ({
        url: API_END_POINTS.getUnreadNotificationCount,
        method: "GET",
      }),
      providesTags: [{ type: "Notifications", id: "unreadCount" }],
    }),

    /////////////////////////////<===NOTIFICATIONS MUTATIONS===>///////////////////
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: API_END_POINTS.markNotificationAsRead(id),
        method: "PUT",
      }),
      invalidatesTags: [
        { type: "Notifications", id: "list" },
        { type: "Notifications", id: "unreadCount" },
      ],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: API_END_POINTS.markAllNotificationsAsRead,
        method: "PUT",
      }),
      invalidatesTags: [
        { type: "Notifications", id: "list" },
        { type: "Notifications", id: "unreadCount" },
      ],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: API_END_POINTS.deleteNotification(id),
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Notifications", id: "list" },
        { type: "Notifications", id: "unreadCount" },
      ],
    }),
  }),

  overrideExisting: true,
});

export const {
  /////////////////////////////<===AUTH MUTATIONS===>//////////////////////////////
  useLoginMutation,
  useSignupMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserProfileMutation,

  /////////////////////////////<===AUTH QUERIES===>////////////////////////////////
  useGetUserProfileQuery,

  /////////////////////////////<===DASHBOARD QUERIES===>//////////////////////////
  useGetDashboardRealtimeQuery,
  useGetDashboardAnalyticsQuery,
  useGetEmployeeDashboardQuery,

  /////////////////////////////<===ANALYTICS QUERIES===>/////////////////////////
  useGetAnalyticsChartsQuery,
  useGetAnalyticsTrendsQuery,
  useGetAnalyticsSummaryQuery,

  /////////////////////////////<===EMPLOYEES QUERIES===>//////////////////////////
  useGetAllEmployeesQuery,
  useGetEmployeeByIdQuery,
  useGetEmployeeAttendanceHistoryQuery,

  /////////////////////////////<===EMPLOYEES MUTATIONS===>///////////////////////
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useChangeEmployeeRoleMutation,
  useUpdateEmployeeStatusMutation,
  useResetEmployeePasswordMutation,

  /////////////////////////////<===ATTENDANCE QUERIES===>/////////////////////////
  useGetAttendanceHistoryQuery,
  useGetTodayAttendanceQuery,
  useGetMonthlyHoursQuery,
  useGetAdminAttendanceHistoryQuery,
  useGetMonthlyMetricsQuery,
  useGetAttendanceLocationsQuery,

  /////////////////////////////<===ATTENDANCE MUTATIONS===>///////////////////////
  useScanQRMutation,
  useSubmitManualEntryMutation,
  useSyncOfflineRecordsMutation,
  useDeleteAttendanceMutation,

  /////////////////////////////<===ATTENDANCE APPROVAL QUERIES===>///////////////
  useGetPendingAttendanceRecordsQuery,

  /////////////////////////////<===ATTENDANCE APPROVAL MUTATIONS===>/////////////
  useUpdateAttendanceRecordStatusMutation,
  useEditAttendanceRecordMutation,

  /////////////////////////////<===WORKPLACES QUERIES===>////////////////////////
  useGetAllWorkplacesQuery,
  useGetWorkplaceByIdQuery,

  /////////////////////////////<===WORKPLACES MUTATIONS===>//////////////////////
  useCreateWorkplaceMutation,
  useCreateWorkplaceWithQRCodeMutation,
  useUpdateWorkplaceMutation,
  useDeleteWorkplaceMutation,

  /////////////////////////////<===QR CODES QUERIES===>//////////////////////////
  useGetAllQRCodesQuery,
  useGetQRCodeByIdQuery,

  /////////////////////////////<===QR CODES MUTATIONS===>////////////////////////
  useCreateQRCodeMutation,
  useUpdateQRCodeMutation,
  useDeleteQRCodeMutation,

  /////////////////////////////<===LEAVE REQUESTS QUERIES===>///////////////////
  useGetAllLeaveRequestsQuery,
  useGetLeaveRequestByIdQuery,
  useGetLeaveRequestStatisticsQuery,

  /////////////////////////////<===LEAVE REQUESTS MUTATIONS===>//////////////////
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestStatusMutation,
  useDeleteLeaveRequestMutation,

  /////////////////////////////<===APP SETTINGS QUERIES===>//////////////////////
  useGetAppSettingsQuery,
  useGetAppVersionQuery,

  /////////////////////////////<===APP SETTINGS MUTATIONS===>////////////////////
  useUpdateAppSettingsMutation,

  /////////////////////////////<===COMPANY SETTINGS QUERIES===>//////////////////
  useGetCompanySettingsQuery,

  /////////////////////////////<===COMPANY SETTINGS MUTATIONS===>/////////////////
  useUpdateCompanySettingsMutation,
  useUpdateCompanyInfoMutation,
  useUpdateWorkingHoursMutation,
  useUpdateOvertimeRulesMutation,
  useUploadCompanyLogoMutation,

  /////////////////////////////<===NOTIFICATIONS QUERIES===>///////////////////////
  useGetAllNotificationsQuery,
  useGetUnreadNotificationCountQuery,

  /////////////////////////////<===NOTIFICATIONS MUTATIONS===>/////////////////////
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} = api;

