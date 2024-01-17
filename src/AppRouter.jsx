import { Route, Routes } from "react-router-dom";
import { AddTestSeries, Dashboard, Earnings, EditTestSeries, Login, Profile, Support, Test, TestSeries, ViewTestSeries } from "./screens";

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
      <Route path="/test-reports" element={<Dashboard />} />
      <Route path="/students" element={<Dashboard />} />
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/earnings/:earnid" element={<Earnings />} />
      <Route path="/settings" element={<Dashboard />} />
      <Route path="/settings" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/support" element={<Support />} />
    </Routes>
  );
};

export default AppRouter;
