import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing Socket.io notifications
 * Handles connection, event listeners, and notification updates
 */
export const useSocketNotifications = (onNotificationReceived, onCountUpdated) => {
  const user = useSelector((state) => state.auth?.user);
  const token = user?.token || localStorage.getItem('auth_token');
  const notificationCallbackRef = useRef(onNotificationReceived);
  const countCallbackRef = useRef(onCountUpdated);

  // Update callback refs when they change
  useEffect(() => {
    notificationCallbackRef.current = onNotificationReceived;
    countCallbackRef.current = onCountUpdated;
  }, [onNotificationReceived, onCountUpdated]);

  useEffect(() => {
    if (!token) {
      console.log('No token available, skipping Socket.io connection');
      return;
    }

    // Connect to Socket.io
    socketService.connect(token);

    // Handle new notification
    const handleNewNotification = (data) => {
      const notification = data.notification;
      console.log('📬 New notification received:', notification);
      
      // Call the callback if provided
      if (notificationCallbackRef.current) {
        notificationCallbackRef.current(notification);
      }

      // Show toast notification
      if (notification.title && notification.message) {
        toast.info(notification.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    // Handle notification update
    const handleNotificationUpdate = (data) => {
      console.log('📝 Notification updated:', data);
      // Call the callback if provided
      if (notificationCallbackRef.current) {
        notificationCallbackRef.current(data.notification, 'update');
      }
    };

    // Handle notification deletion
    const handleNotificationDeletion = (data) => {
      console.log('🗑️ Notification deleted:', data);
      // Call the callback if provided
      if (notificationCallbackRef.current) {
        notificationCallbackRef.current({ id: data.notification_id }, 'delete');
      }
    };

    // Handle count update
    const handleCountUpdate = (data) => {
      console.log('🔢 Notification count updated');
      // Call the callback if provided
      if (countCallbackRef.current) {
        countCallbackRef.current();
      }
    };

    // Register event listeners
    socketService.on('new_notification', handleNewNotification);
    socketService.on('notification_updated', handleNotificationUpdate);
    socketService.on('notification_deleted', handleNotificationDeletion);
    socketService.on('notification_count_updated', handleCountUpdate);

    // Connection status listeners
    socketService.on('socket_connected', () => {
      console.log('✅ Socket.io connected successfully');
    });

    socketService.on('socket_disconnected', (data) => {
      console.warn('⚠️ Socket.io disconnected:', data.reason);
    });

    socketService.on('socket_reconnected', (data) => {
      console.log('🔄 Socket.io reconnected after', data.attemptNumber, 'attempts');
      // Refetch notifications after reconnection
      if (countCallbackRef.current) {
        countCallbackRef.current();
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.off('new_notification', handleNewNotification);
      socketService.off('notification_updated', handleNotificationUpdate);
      socketService.off('notification_deleted', handleNotificationDeletion);
      socketService.off('notification_count_updated', handleCountUpdate);
      socketService.off('socket_connected');
      socketService.off('socket_disconnected');
      socketService.off('socket_reconnected');
    };
  }, [token]);

  // Disconnect on logout
  useEffect(() => {
    if (!user) {
      console.log('User logged out, disconnecting Socket.io');
      socketService.disconnect();
    }
  }, [user]);

  return {
    isConnected: socketService.getConnectionStatus().isConnected,
    socketId: socketService.getConnectionStatus().socketId,
  };
};


