import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";

import { HomePage } from "./pages/HomePage";
import { AboutPlatformPage } from "./pages/AboutPlatformPage";
import { ResearchLibraryPage } from "./pages/ResearchLibraryPage";
import { ResearchDetailsPage } from "./pages/ResearchDetailsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>

        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPlatformPage />} />
        <Route path="/library" element={<ResearchLibraryPage />} />
        <Route path="/research/:id" element={<ResearchDetailsPage />} />
        <Route path="/services" element={<ServicesPage />} />

        {/* 🔥 LOGIN */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 🔥 DASHBOARD */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />

      </Route>
    </Routes>
  );
}

export default App;