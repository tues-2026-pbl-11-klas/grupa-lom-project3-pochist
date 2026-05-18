import { useState, useCallback } from "react";
import { AppProvider } from "./context/AppContext.tsx";
import AuthView from "./pages/AuthView.tsx";
import Main from "./Main.tsx";

export default function App() {
  const [authenticated, setAuthenticated] = useState(
    () => !!localStorage.getItem("cw_token"),
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("cw_token");
    setAuthenticated(false);
  }, []);

  if (!authenticated) {
    return <AuthView onAuthenticated={() => setAuthenticated(true)} />;
  }

  return (
    <AppProvider onLogout={handleLogout}>
      <Main />
    </AppProvider>
  );
}