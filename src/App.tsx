
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./components/routing/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors closeButton position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
