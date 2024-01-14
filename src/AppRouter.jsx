import { Route, Routes } from "react-router-dom";
import { AddTestSeries, Dashboard, EditTestSeries, Login, Test, TestSeries, ViewTestSeries } from "./screens";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test-series" element={<TestSeries />} />
      <Route path="/test-series/add" element={<AddTestSeries />} />
      <Route path="/test-series/edit/:id" element={<EditTestSeries />} />
      <Route path="/test-series/:series_id" element={<ViewTestSeries />} />
      <Route path="/test-series/:series_id/test/:test_id/questions" element={<Test />} />
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
