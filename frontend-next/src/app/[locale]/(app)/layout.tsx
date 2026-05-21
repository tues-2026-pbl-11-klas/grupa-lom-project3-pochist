import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/nav/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen">
        <Navbar />
        {children}
      </div>
    </AppProvider>
  );
}
