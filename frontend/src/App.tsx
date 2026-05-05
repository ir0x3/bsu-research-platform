import { useState } from "react";
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

const PASSWORD = "2002"; //  password

function App() {
  const [allowed, setAllowed] = useState(false);
  const [input, setInput] = useState("");

  //  شاشة الحماية
  if (!allowed) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-[300px]">
          <h2 className="mb-4 font-bold text-lg">The site is protected</h2>

          <input
            type="password"
            placeholder="Enter password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-2 rounded w-full mb-3 text-center"
          />

          <button
            onClick={() => {
              if (input === PASSWORD) {
                setAllowed(true);
              }
            }}
            className="bg-[#658DB7] text-white px-4 py-2 rounded w-full"
          >
            دخول
          </button>
        </div>
      </div>
    );
  }

  //
  return (
    <Routes>
      <Route element={<Layout />}>

        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPlatformPage />} />
        <Route path="/library" element={<ResearchLibraryPage />} />
        <Route path="/research/:id" element={<ResearchDetailsPage />} />
        <Route path="/services" element={<ServicesPage />} />

        {/*  LOGIN */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/*  DASHBOARD */}
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