import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageAdmins from "./pages/ManageAdmins";
import ManageApplicants from "./pages/ManageApplicants";
import ManageEmployer from "./pages/ManageEmployer";
import ManageAnnouncement from "./pages/ManageAnnouncement";
import ManageJobs from "./pages/ManageJobs";
import SettingsSuperAdmin from "./pages/Settings_SuperAdmin";
import SettingsAdmin from "./pages/Settings_Admin";

function App() {
  const [userRole, setUserRole] = useState(null); // default to null
  const location = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    console.log("Retrieved userRole from localStorage:", role); // Console log here
    setUserRole(role);
  }, []);

  console.log("Current path:", location.pathname); // Console log here
  console.log("Current userRole:", userRole); // Console log here

  if (location.pathname === "/") {
    return <Login />;
  }

  // Handle the case where the userRole is not yet loaded (or still undefined)
  if (userRole === null) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <Layout userRole={userRole}>
      <Routes>
        {userRole === "superadmin" ? (
          <>
            <Route path="/superadminDashboard" element={<SuperAdminDashboard />} />
            <Route path="/admins" element={<ManageAdmins />} />
            <Route path="/superadminSettings" element={<SettingsSuperAdmin />} />
          </>
        ) : (
          <>
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/applicants" element={<ManageApplicants />} />
            <Route path="/employers" element={<ManageEmployer />} />
            <Route path="/announcements" element={<ManageAnnouncement />} />
            <Route path="/jobs" element={<ManageJobs />} />
            <Route path="/adminSettings" element={<SettingsAdmin />} />
          </>
        )}
      </Routes>
    </Layout>
  );
}

export default App;
