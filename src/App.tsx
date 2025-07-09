
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AppRoutes from "./components/routing/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster richColors closeButton position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
