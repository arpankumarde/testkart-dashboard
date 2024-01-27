import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import {
  DashboardLineChart,
  DashboardOverviewCard,
  DashboardTopTestCard,
} from "../components";
import { PiStudentFill } from "react-icons/pi";
import { TbCoinRupeeFilled } from "react-icons/tb";
import { BsFillCartFill } from "react-icons/bs";
import { IoIosPaper } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({});
  const [timeframe, setTimeframe] = useState("month");

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!auth.user) return navigate("/login");

    server
      .get("/api/v1/studio/dashboard")
      .then((res) => {
        if (!res.data.success) return alert(res.data.error);
        setDashboard(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        if (err.response.status === 401) auth.logout();
        else console.log(err.response);
      });
  }, [auth.user, navigate, auth]);

  return (
    <section className="md:p-4 lg:p-8">
      <div className="bg-white md:rounded-md p-4 pb-6 md:mb-4 lg:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Overview</h2>
          <div className="flex">
            <select
              name="period"
              defaultValue={timeframe}
              className="cursor-pointer border border-gray-200 appearance-none pl-4 pr-8 py-1.5 rounded-md outline-none bg-gray-100 active:bg-gray-200 [&>*]:bg-white"
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="week">Last week</option>
              <option value="month">Last month</option>
              <option value="year">Last year</option>
            </select>
            <i className="pointer-events-none -ml-8 pr-1 inline-flex items-center text-[#6d45a4]">
              <RiArrowDropDownLine size={29} />
            </i>
          </div>
        </div>
        <div className="flex flex-wrap justify-center lg:justify-evenly gap-4 w-full">
          <DashboardOverviewCard
            name={"Students"}
            icon={<PiStudentFill size={30} />}
            timeframe={timeframe}
            cardData={dashboard?.widgets?.students}
          />
          <DashboardOverviewCard
            name={"Earnings"}
            icon={<TbCoinRupeeFilled size={30} />}
            timeframe={timeframe}
            cardData={dashboard?.widgets?.earnings}
          />
          <DashboardOverviewCard
            name={"Series Sold"}
            icon={<BsFillCartFill size={30} />}
            timeframe={timeframe}
            cardData={dashboard?.widgets?.test_series_sell}
          />
          <DashboardOverviewCard
            name={"Tests Taken"}
            icon={<IoIosPaper size={30} />}
            timeframe={timeframe}
            cardData={dashboard?.widgets?.tests_taken}
          />
        </div>
      </div>

      <hr className="border-gray-300 md:hidden" />

      <div className="flex flex-col lg:flex-row md:gap-4 lg:gap-8">
        <div className="bg-white md:rounded-md p-4 flex-1">
          <h2 className="text-xl">Earnings</h2>
          <div className="my-4 flex justify-evenly [&>div>h4]:text-lg [&>div>h4]:font-bold [&>div>h4]:text-gray-600">
            <div className="flex flex-col items-center">
              <h4>
                {dashboard?.earnings
                  ? dashboard?.earnings?.overview?.total.toFixed(2)
                  : 0}
              </h4>
              <h5>Marketplace</h5>
            </div>
            <div className="flex flex-col items-center">
              <h4>
                {dashboard?.earnings
                  ? dashboard?.earnings?.overview?.last_week.toFixed(2)
                  : 0}
              </h4>
              <h5>Last week</h5>
            </div>
            <div className="flex flex-col items-center">
              <h4>
                {dashboard?.earnings
                  ? dashboard?.earnings?.overview?.last_month.toFixed(2)
                  : 0}
              </h4>
              <h5>Last Month</h5>
            </div>
          </div>
          <div className="sm:flex sm:justify-center overflow-x-auto">
            <DashboardLineChart
              data={dashboard?.earnings?.graph}
              xKey="month"
              line="income"
            />
          </div>
        </div>

        <hr className="border-gray-300 md:hidden" />

        <div className="bg-white md:rounded-md p-4 lg:w-96">
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-xl">Top test series</h2>
            <Link
              to="/test-series"
              className="cursor-pointer appearance-none p-4 py-1.5 rounded-md outline-none border border-gray-200 bg-gray-100 active:bg-gray-200 [&>*]:bg-white"
            >
              View All
            </Link>
          </div>
          <div className="overflow-y-auto lg:h-96">
            {dashboard?.recent_test_series?.map((testSeries) => (
              <DashboardTopTestCard
                key={testSeries.hash}
                title={testSeries.title}
                desc={testSeries.description}
                img={testSeries.cover_photo}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
