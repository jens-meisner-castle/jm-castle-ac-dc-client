import { Route, Routes } from "react-router-dom";
import { Page as DashboardPage } from "../pages/dashboard/Page";
import { Page as DbTestPage } from "../pages/database-test/Page";
import { Page as DevicesPage } from "../pages/devices/Page";
import { Page as EnginesPage } from "../pages/engines/Page";
import { Page as HelpPage } from "../pages/help/Page";
import { Page as HistoryPage } from "../pages/history/Page";
import { Page as SimulationPage } from "../pages/simulation/Page";
import { Page as StartPage } from "../pages/start/Page";
import { Page as SystemSetupPage } from "../pages/system-setup/Page";
import { Page as SystemStatusPage } from "../pages/system-status/Page";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/device" element={<DevicesPage />} />
      <Route path="/engine" element={<EnginesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/system-setup" element={<SystemSetupPage />} />
      <Route path="/system" element={<SystemStatusPage />} />
      <Route path="/database-test" element={<DbTestPage />} />
      <Route path="/simulation" element={<SimulationPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/" element={<StartPage />} />
    </Routes>
  );
};
