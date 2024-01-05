import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./screens";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/test-series" element={<Dashboard />} />
      <Route path="/earnings/overview" element={<Dashboard />} />
      <Route path="/earnings/withdraw" element={<Dashboard />} />
      <Route path="/earnings/transactions" element={<Dashboard />} />
      <Route path="/earnings/request-statement" element={<Dashboard />} />
      <Route path="/earnings/settings" element={<Dashboard />} />
      <Route path="/update-settings" element={<Dashboard />} />
      <Route path="/support" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRouter;
