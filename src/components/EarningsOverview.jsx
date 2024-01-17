import { MdBarChart } from "react-icons/md";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const EarningsOverview = () => {
  const data = [
    { month: "Jan", income: 1000 },
    { month: "Feb", income: 1500 },
    { month: "Mar", income: 2000 },
    { month: "Apr", income: 1800 },
    { month: "May", income: 2200 },
    { month: "Jun", income: 2500 },
    { month: "Jul", income: 1900 },
    { month: "Aug", income: 2100 },
    { month: "Sep", income: 2300 },
    { month: "Oct", income: 1700 },
    { month: "Nov", income: 2400 },
    { month: "Dec", income: 2800 },
  ];

  return (
    <div className="bg-white md:rounded-md p-4 flex-1">
      <h2 className="text-xl flex items-center gap-2 mb-4">
        <i>
          <MdBarChart size={25} />
        </i>
        <span>Last year Income Overview</span>
      </h2>
      <hr className="pb-4 md:pb-0" />
      <div className="h-full flex items-center overflow-y-auto">
        <div className="w-full overflow-x-auto">
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#6d45a4" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default EarningsOverview;
