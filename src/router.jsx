import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./global/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UnauthorizedPage from "./pages/Unauthor";
import AuthGuard from "./components/AuthGuard";
import AuthRedirect from "./utils/AuthRedirect";

// Dashboard imports
import AdminDashboard from "./pages/adminRole/dashboard";
import ManageWorkplaces from "./pages/adminRole/manageWorkplaces";
import ManageQrCode from "./pages/adminRole/manageQrCode";
import SettingsPage from "./pages/adminRole/settingspage";
import ApproveRequests from "./pages/adminRole/approverequests";
import ViewMap from "./pages/adminRole/viewMap";
import AttendanceDashboard from "./pages/adminRole/attandance";
import EmployeeDashboard from "./pages/adminRole/employemanage";
import RolesManage from "./pages/adminRole/rolesmanage";

const AppRouter = () => {
  return (
    <Routes>
      {/* Root route - redirect based on authentication */}
      <Route path="/" element={<AuthRedirect />} />

      {/* Authentication Routes - No Layout (Full Page) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Admin Dashboard Routes - Using AppLayout */}
      <Route
        path="/admin"
        element={
          <AuthGuard>
            <AppLayout />
          </AuthGuard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<EmployeeDashboard />} />
        <Route path="roles" element={<RolesManage />} />
        <Route path="manage-workplaces" element={<ManageWorkplaces />} />
        <Route path="manage-qr-code" element={<ManageQrCode />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="approve-requests" element={<ApproveRequests />} />
        <Route path="view-map" element={<ViewMap />} />
        <Route path="attendance" element={<AttendanceDashboard />} />
      </Route>

      {/* Catch all route for 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-800">
              <h1 className="text-4xl font-poppins font-bold mb-4">404</h1>
              <p className="text-xl font-poppins">Page not found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRouter;
