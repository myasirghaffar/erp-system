import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';

/**
 * Custom hook for managing Socket.io attendance updates
 * Handles connection, event listeners, and attendance updates
 * @param {Function} onAttendanceReceived - Callback when new attendance is received
 */
export const useSocketAttendance = (onAttendanceReceived) => {
  const user = useSelector((state) => state.auth?.user);
  const token = user?.token || localStorage.getItem('auth_token');
  const attendanceCallbackRef = useRef(onAttendanceReceived);

  // Update callback ref when it changes
  useEffect(() => {
    attendanceCallbackRef.current = onAttendanceReceived;
  }, [onAttendanceReceived]);

  useEffect(() => {
    if (!token) {
      console.log('No token available, skipping Socket.io connection for attendance');
      return;
    }

    // Connect to Socket.io if not already connected
    socketService.connect(token);

    // Handle attendance updates
    const handleAttendanceUpdate = (data) => {
      console.log('📊 New attendance update received:', data);
      
      // Call the callback if provided
      if (attendanceCallbackRef.current && data?.attendance) {
        attendanceCallbackRef.current(data.attendance, data.event_type);
      }
    };

    // Register event listener
    socketService.on('attendance_updated', handleAttendanceUpdate);

    // Cleanup on unmount
    return () => {
      socketService.off('attendance_updated', handleAttendanceUpdate);
    };
  }, [token]);

  return {
    isConnected: socketService.getConnectionStatus().isConnected,
    socketId: socketService.getConnectionStatus().socketId,
  };
};

