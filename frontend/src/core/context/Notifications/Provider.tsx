"use client";

import Notification from "@/core/components/Alerts";
import { NotificationState } from "@/core/interfaces/NotificationsContext.interface";
import { NotificationType } from "@/core/types/Notifications.type";
import { ReactNode, useCallback, useState } from "react";
import NotificationContext from "./context";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    type: "ok",
    title: "",
    message: "",
  });

  const showNotification = useCallback((type: NotificationType, title: string, message: string) => {
    setNotification({ open: true, type, title, message });
  }, []);

  const handleClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }
    }>
      {children}
      {
        notification.open && (
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={handleClose}
          />
        )
      }
    </NotificationContext.Provider>
  );
};