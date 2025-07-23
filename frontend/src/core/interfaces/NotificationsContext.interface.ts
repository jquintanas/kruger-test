import { NotificationType } from "../types/Notifications.type";

export interface NotificationState {
  open: boolean;
  type: NotificationType;
  title: string;
  message: string;
}