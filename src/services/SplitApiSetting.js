import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../store/slices/authSlice';
import { BASE_URL } from './ApiEndpoints';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL || 'http://localhost:3000',
  prepareHeaders: async (headers, { getState }) => {
    try {
      const token = getState().auth?.user?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        headers.set('accept', 'application/json');
      } else {
        headers.set('authorization', '');
      }
    } catch (err) {
      headers.set('authorization', '');
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout(null));
  }
  return result;
};

export const SplitApiSettings = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    'UpdateUserList',
    'Dashboard',
    'Analytics',
    'Employees',
    'EmployeeAttendance',
    'Attendance',
    'AttendanceApproval',
    'Workplaces',
    'QRCodes',
    'LeaveRequests',
    'AppSettings',
  ]
});