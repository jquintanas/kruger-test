import { NotificationContextProps } from "@/core/types/Notifications.type";
import { createContext } from "react";

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export default NotificationContext;

