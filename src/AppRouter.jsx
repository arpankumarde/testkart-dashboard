import { Route, Routes } from "react-router-dom";
import {
  AddTestSeries,
  Dashboard,
  Earnings,
  EditTestSeries,
  Login,
  Notifications,
  Profile,
  Settings,
  Signup,
  Students,
  StudentsDetails,
  Test,
  TestReports,
  TestReportsDetails,
  TestSeries,
  ViewTestSeries,
} from "./screens";
import Publish from "./screens/Publish";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/test-series" element={<TestSeries />} />
      <Route path="/test-series/add" element={<AddTestSeries />} />
      <Route path="/test-series/edit/:id" element={<EditTestSeries />} />
      <Route path="/test-series/:series_id" element={<ViewTestSeries />} />
      <Route path="/test-series/:series_id/publish" element={<Publish />} />
      <Route
        path="/test-series/:series_id/test/:test_id/questions"
        element={<Test />}
      />

      <Route path="/test-reports" element={<TestReports />} />
      <Route path="/test-reports/:seriesid" element={<TestReportsDetails />} />

      <Route path="/students" element={<Students />} />
      <Route path="/students/:stdid" element={<StudentsDetails />} />

      <Route path="/earnings" element={<Earnings />} />
      <Route path="/earnings/:earnid" element={<Earnings />} />

      <Route path="/notifications" element={<Notifications />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRouter;
