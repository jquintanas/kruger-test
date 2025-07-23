export type NotificationType = "ok" | "error" | "warn";

export type NotificationContextProps = {
  showNotification: (type: NotificationType, title: string, message: string) => void;
}