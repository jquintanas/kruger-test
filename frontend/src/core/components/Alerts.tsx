"use client";

import { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle } from "react-icons/fa";

type NotificationType = "ok" | "error" | "warn";

interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  onClose: () => void;
}

const icons = {
  ok: <FaCheckCircle className="text-green-500 w-6 h-6" />,
  error: <FaExclamationCircle className="text-red-500 w-6 h-6" />,
  warn: <FaExclamationTriangle className="text-yellow-500 w-6 h-6" />,
};

const bgColors = {
  ok: "bg-green-50 border-green-400",
  error: "bg-red-50 border-red-400",
  warn: "bg-yellow-50 border-yellow-400",
};

const textColors = {
  ok: "text-green-800",
  error: "text-red-800",
  warn: "text-yellow-800",
};

export default function Notification({
  type,
  title,
  message,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 border-l-4 shadow-lg px-6 py-4 rounded flex items-start gap-3 min-w-[280px] max-w-xs ${bgColors[type]}`}
      role="alert"
    >
      <div className="mt-1">{icons[type]}</div>
      <div className="flex-1">
        <div className={`font-bold mb-1 ${textColors[type]}`}>{title}</div>
        <div className="text-sm text-gray-700">{message}</div>
      </div>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
}