import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        if (err.response.status === 401) auth.logout();
        else console.log(err.response);
      });
  }, [auth.user]);

  const chartData = [
    { Month: "Jan", Earning: 400 },
    { Month: "Feb", Earning: 300 },
    { Month: "Mar", Earning: 500 },
    { Month: "Apr", Earning: 200 },
    { Month: "May", Earning: 600 },
    { Month: "Jun", Earning: 400 },
    { Month: "Jul", Earning: 200 },
    { Month: "Aug", Earning: 800 },
    { Month: "Sep", Earning: 900 },
    { Month: "Oct", Earning: 700 },
    { Month: "Nov", Earning: 700 },
    { Month: "Dec", Earning: 600 },
  ];

  return (
    <section className="md:p-4 lg:p-8">
      <div className="bg-white md:rounded-md p-4 pb-6 md:mb-4 lg:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Overview</h2>
          <div className="relative">
            <select
              name="period"
              defaultValue={"m"}
              className="cursor-pointer border border-gray-200 appearance-none pl-4 pr-8 py-1.5 rounded-md outline-none bg-gray-100 active:bg-gray-200 [&>*]:bg-white"
            >
              <option value="w">Last week</option>
              <option value="m">Last month</option>
              <option value="y">Last year</option>
              <option value="all">All time</option>
            </select>
            <i className="pointer-events-none absolute inset-y-0 right-0 pr-1 flex items-center text-[#6d45a4]">
              <RiArrowDropDownLine size={29} />
            </i>
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
      </div>

      <hr className="border-gray-300 md:hidden" />

      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        <div className="bg-white md:rounded-md p-4 flex-1">
          <h2 className="text-xl">Earnings</h2>
          <div className="my-4 flex justify-evenly [&>div>h4]:text-lg [&>div>h4]:font-bold [&>div>h4]:text-gray-600">
            <div className="flex flex-col items-center">
              <h4>3652</h4>
              <h5>Marketplace</h5>
            </div>
            <div className="flex flex-col items-center">
              <h4>5421</h4>
              <h5>Last week</h5>
            </div>
            <div className="flex flex-col items-center">
              <h4>9652</h4>
              <h5>Last Month</h5>
            </div>
          </div>
          <div className="sm:flex sm:justify-center overflow-x-auto">
            <DashboardLineChart data={chartData} />
          </div>
        </div>

        <hr className="border-gray-300 md:hidden" />

        <div className="bg-white md:rounded-md p-4 lg:w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">Top test series</h2>
            <button className="cursor-pointer appearance-none p-4 py-1.5 rounded-md outline-none border border-gray-200 bg-gray-100 active:bg-gray-200 [&>*]:bg-white">
              View All
            </button>
          </div>
          <div className="overflow-y-auto h-96">
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
