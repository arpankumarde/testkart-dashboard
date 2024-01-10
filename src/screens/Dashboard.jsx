import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { DashboardOverviewCard } from "../components";
import { PiStudentFill } from "react-icons/pi";
import { TbCoinRupeeFilled } from "react-icons/tb";
import { BsFillCartFill } from "react-icons/bs";
import { IoIosPaper } from "react-icons/io";

const Dashboard = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState();
  console.log(dashboard);

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!auth.user) return navigate("/login");

    server
      .get("/api/v1/studio/dashboard")
      .then((res) => {
        setDashboard(res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  }, [auth.user]);

  return (
    <section className="md:p-4 lg:p-8">
      <section className="bg-white md:rounded-md p-4 pb-6 md:mb-4 lg:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Overview</h2>
          <div className="relative">
            <select
              name="period"
              className="cursor-pointer appearance-none pl-4 pr-6 py-1.5 rounded-md outline-none bg-gray-100 active:bg-gray-200 [&>*]:bg-white"
            >
              <option value="w" selected>
                Last week
              </option>
              <option value="m">Last month</option>
              <option value="y">Last year</option>
              <option value="all">All time</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6d45a4]">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center lg:justify-evenly gap-4 w-full">
          <DashboardOverviewCard
            name={"Students"}
            icon={<PiStudentFill size={30} />}
            prev={"+11%"}
            trend={"1456"}
            up={1}
            total={1325}
          />
          <DashboardOverviewCard
            name={"Earnings"}
            icon={<TbCoinRupeeFilled size={30} />}
            prev={"+22%"}
            trend={"3567"}
            up={1}
            last={3426}
          />
          <DashboardOverviewCard
            name={"Series Sold"}
            icon={<BsFillCartFill size={30} />}
            prev={"-02%"}
            trend={"18"}
            up={0}
            last={15}
          />
          <DashboardOverviewCard
            name={"Tests Taken"}
            icon={<IoIosPaper size={30} />}
            prev={"+10%"}
            trend={"15234"}
            up={1}
            last={14256}
          />
        </div>
      </section>
      <hr className="border-gray-300 lg:hidden" />
      <section className="bg-white md:rounded-md p-4">Test Section</section>
    </section>
  );
};

export default Dashboard;
