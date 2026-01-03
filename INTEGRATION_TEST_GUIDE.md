# API Integration Test Guide

This guide provides instructions for testing all API integrations in the admin dashboard.

## Prerequisites

1. **Backend Server Running**
   - Ensure the ERP-Backend server is running on the configured port
   - Default: `http://localhost:3000` (or as configured in `.env`)

2. **Frontend Server Running**
   - Start the frontend: `npm run dev` in `erp-admin-dashboard`
   - Default: `http://localhost:5173` (or as configured)

3. **Authentication**
   - Login as an admin user to access all features
   - Token should be automatically stored in Redux state

## Test Checklist

### 1. Dashboard Screen (`/admin/dashboard`)

**Test Cases:**
- [ ] Dashboard cards display real-time data
- [ ] Active employees count matches backend
- [ ] Hours worked calculation is correct
- [ ] Check-ins count updates in real-time
- [ ] Loading states display correctly
- [ ] Error handling works if API fails

**API Endpoints Used:**
- `GET /api/dashboard/realtime`
- `GET /api/analytics/summary`

**Expected Behavior:**
- Cards show actual numbers from backend
- Data refreshes automatically
- Loading spinner shows during fetch

---

### 2. Attendance Dashboard (`/admin/attendance`)

**Test Cases:**
- [ ] Attendance cards show correct metrics
- [ ] Attendance report table loads data
- [ ] Filters work (workplace, type, date range)
- [ ] Pagination works correctly
- [ ] Total worked hours calculation is accurate
- [ ] Table shows employee names, check-in/out times
- [ ] Status colors are correct (green/red/gray)

**API Endpoints Used:**
- `GET /api/dashboard/realtime`
- `GET /api/attendance/admin-history`
- `GET /api/attendance/admin/monthly-metrics`
- `GET /api/workplaces`

**Expected Behavior:**
- Table populated with real attendance records
- Filters update table data
- Pagination navigates through pages
- Total hours calculated from actual data

---

### 3. Employee Management (`/admin/users`)

**Test Cases:**
- [ ] Employee list loads with pagination
- [ ] Search functionality works
- [ ] Filters (department, role, status) work
- [ ] Create new employee form validates correctly
- [ ] Edit employee form pre-fills data
- [ ] Delete employee works with confirmation
- [ ] Status toggle updates employee status
- [ ] View profile shows employee details

**API Endpoints Used:**
- `GET /api/employees` (with pagination, search, filters)
- `POST /api/employees` (create)
- `PUT /api/employees/:id` (update)
- `DELETE /api/employees/:id` (delete)
- `PUT /api/employees/:id/status` (update status)

**Validation Tests:**
- [ ] Full name required (2-100 chars)
- [ ] Email required and valid format
- [ ] Phone optional but must be valid international format
- [ ] Position max 100 characters
- [ ] Role must be admin/manager/employee
- [ ] Backend validation errors display correctly

**Expected Behavior:**
- Form shows validation errors in real-time
- Success toast appears on save
- Error toast shows backend validation errors
- List refreshes after create/update/delete

---

### 4. Workplace Management (`/admin/manage-workplaces`)

**Test Cases:**
- [ ] Workplace list loads with pagination
- [ ] Create workplace form validates
- [ ] Map click sets latitude/longitude
- [ ] Geofence radius slider works (10-1000m)
- [ ] Edit workplace pre-fills form
- [ ] Delete workplace works with confirmation
- [ ] QR codes list loads for workplaces
- [ ] QR code status filter works

**API Endpoints Used:**
- `GET /api/workplaces` (with pagination)
- `POST /api/workplaces` (create)
- `PUT /api/workplaces/:id` (update)
- `DELETE /api/workplaces/:id` (delete)
- `GET /api/qrcodes` (with filters)

**Validation Tests:**
- [ ] Name required (2-100 chars)
- [ ] Address required (min 5 chars)
- [ ] Latitude required (-90 to 90)
- [ ] Longitude required (-180 to 180)
- [ ] Geofence radius (10-1000 meters)

**Expected Behavior:**
- Map interactive - clicking sets coordinates
- Form validates before submission
- Success/error toasts display
- List refreshes after operations

---

### 5. QR Code Management (`/admin/manage-qr-code`)

**Test Cases:**
- [ ] QR code list loads
- [ ] Status filter (All/Active/Inactive) works
- [ ] Create QR code form validates
- [ ] Workplace dropdown populated
- [ ] QR code preview generates after save
- [ ] Download PNG works
- [ ] Edit QR code pre-fills form
- [ ] Delete QR code works

**API Endpoints Used:**
- `GET /api/qrcodes` (with filters)
- `POST /api/qrcodes` (create)
- `PUT /api/qrcodes/:id` (update)
- `DELETE /api/qrcodes/:id` (delete)
- `GET /api/workplaces` (for dropdown)

**Validation Tests:**
- [ ] Workplace ID required
- [ ] Company name required (1-100 chars)
- [ ] Department required (1-100 chars)
- [ ] Contact number required and valid format
- [ ] Email required and valid format
- [ ] Expires at optional (ISO 8601 date)

**Expected Behavior:**
- QR code preview appears after generation
- Download button works
- Form validates all fields
- Success/error toasts display

---

### 6. Approve Requests (`/admin/approve-requests`)

**Test Cases:**
- [ ] Leave requests list loads
- [ ] Statistics cards show correct counts
- [ ] Filters work (status, type, department)
- [ ] Approve button works
- [ ] Reject button works with reason
- [ ] Pagination works
- [ ] Status updates reflect immediately

**API Endpoints Used:**
- `GET /api/leave-requests` (with filters)
- `GET /api/leave-requests/statistics`
- `PUT /api/leave-requests/:id/status`

**Validation Tests:**
- [ ] Rejection reason required when rejecting
- [ ] Status must be approved/rejected

**Expected Behavior:**
- Statistics update after approve/reject
- List refreshes automatically
- Modals show confirmation
- Success/error toasts display

---

### 7. View Map (`/admin/view-map`)

**Test Cases:**
- [ ] Map loads with workplace markers
- [ ] Employee location markers display
- [ ] Markers show correct popup information
- [ ] Map centers on first workplace
- [ ] Legend displays correctly

**API Endpoints Used:**
- `GET /api/workplaces` (for markers)
- `GET /api/attendance/locations` (for employee locations)

**Expected Behavior:**
- Markers appear on map
- Popups show correct data
- Map is interactive

---

### 8. Settings Page (`/admin/settings`)

**Test Cases:**
- [ ] App settings load (if available)
- [ ] Form fields are editable
- [ ] Save buttons are functional
- [ ] Note about missing company settings API displays

**API Endpoints Used:**
- `GET /api/app-settings`
- `PUT /api/app-settings`

**Expected Behavior:**
- User app settings can be updated
- Company settings show info message (API not available)

---

## Common Test Scenarios

### Error Handling
1. **Network Errors:**
   - Disconnect internet
   - Verify error messages display
   - Check loading states

2. **Validation Errors:**
   - Submit forms with invalid data
   - Verify field-level error messages
   - Check backend validation errors display

3. **401 Unauthorized:**
   - Token expires
   - Verify redirect to login
   - Check token refresh (if implemented)

### Loading States
- All API calls show loading indicators
- Buttons disabled during submission
- Tables show loading placeholders

### Data Consistency
- Lists refresh after create/update/delete
- Pagination reflects correct totals
- Filters maintain state correctly

## Manual Testing Steps

1. **Start Backend:**
   ```bash
   cd ERP-Backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd erp-admin-dashboard
   npm run dev
   ```

3. **Login:**
   - Navigate to login page
   - Use admin credentials
   - Verify token stored

4. **Test Each Screen:**
   - Navigate through all screens
   - Test create/update/delete operations
   - Verify data persistence
   - Check error handling

5. **Check Browser Console:**
   - No JavaScript errors
   - API calls successful
   - Network tab shows correct requests

6. **Check Network Tab:**
   - Verify correct endpoints called
   - Check request payloads
   - Verify response formats
   - Check status codes (200, 400, 401, etc.)

## Known Issues / Missing APIs

1. **Company Settings API:**
   - Working hours, overtime rules need backend endpoint
   - Currently shows info message

2. **Roles Management API:**
   - Permissions matrix needs backend endpoint
   - Currently uses mock data

## Troubleshooting

### API Calls Failing
- Check backend server is running
- Verify CORS configuration
- Check API base URL in `.env`
- Verify authentication token

### Forms Not Submitting
- Check browser console for errors
- Verify validation passes
- Check network tab for request details
- Verify backend endpoint exists

### Data Not Loading
- Check API response format matches expected
- Verify data transformation logic
- Check Redux state
- Verify pagination parameters

## Success Criteria

✅ All screens load data from backend
✅ Create/Update/Delete operations work
✅ Validation errors display correctly
✅ Loading states show during API calls
✅ Error handling works for failed requests
✅ Data refreshes after mutations
✅ Pagination works correctly
✅ Filters work as expected

