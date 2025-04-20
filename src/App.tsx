import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import MainLayout from "@/components/layout/MainLayout";
import DashboardView from "@/components/dashboard/DashboardView";
import ProjectDetails from "@/components/projects/ProjectDetails";
import { Toaster } from "sonner";

function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </Router>
      <Toaster position="top-right" />
    </AppProvider>
  );
}

export default App;
