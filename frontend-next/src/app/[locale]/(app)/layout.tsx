import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/nav/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { NotificationBridge } from "@/components/toasts/NotificationBridge";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <Navbar />
        {children}
        <Toaster theme="dark" position="top-right" richColors />
        <NotificationBridge />
      </div>
    </AppProvider>
  );
}
