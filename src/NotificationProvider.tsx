import React, { createContext, FC, ReactNode, useState } from "react";
import "./NotificationProvider.css";
type NotifyTypes = "success" | "error" | "warning" | "info" | undefined;

interface Notify {
  text: string;
  type?: NotifyTypes;
  duration?: number;
}

interface NotificationContextType {
  notification: string;
  handleNotify: (notify: Notify) => void;
  clearNotification: () => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notification: "",
  handleNotify: () => {},
  clearNotification: () => {},
});

export const NotificationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState("");
  const [type, setType] = useState<NotifyTypes>();

  const handleNotify = ({ text, type = "info", duration = 8000 }: Notify) => {
    // post data to API
    // Update notification
    setNotification(`${text}`);
    setType(type);

    // Clear notification after x ms
    setTimeout(() => setNotification(""), duration);
  };

  const clearNotification = () => {
    setNotification("");
  };

  return (
    <NotificationContext.Provider
      value={{ notification, handleNotify, clearNotification }}
    >
      <div
        className={`notification ${type}`}
        hidden={!notification}
        onClick={clearNotification}
      >
        {notification}
      </div>
      {children}
    </NotificationContext.Provider>
  );
};
