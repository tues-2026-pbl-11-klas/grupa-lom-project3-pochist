import { useEffect } from "react";
import "../styles/Toast.css";
import { useApp } from "../context/AppContext.tsx";

interface Notification {
  id: number;
  type?: string;
  message: string;
  duration?: number;
}

function SingleToast({ notif }: { notif: Notification }) {
  const { dismissNotification } = useApp();
  useEffect(() => {
    if (!notif.duration) return;
    const t = setTimeout(() => dismissNotification(notif.id), notif.duration);
    return () => clearTimeout(t);
  }, [notif.id, notif.duration, dismissNotification]);

  return (
    <div
      className={`toast toast--${notif.type || "info"}`}
      onClick={() => dismissNotification(notif.id)}
      role="alert"
    >
      {notif.message}
    </div>
  );
}

export default function Toast() {
  const { notifications } = useApp();
  if (!notifications.length) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {notifications.slice(0, 3).map((n: Notification) => (
        <SingleToast key={n.id} notif={n} />
      ))}
    </div>
  );
}
