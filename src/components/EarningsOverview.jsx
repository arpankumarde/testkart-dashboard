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

const EarningsOverview = ({ graphData = [{}], xKey = "", barKey = "" }) => {
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
          <BarChart
            width={600}
            height={300}
            data={graphData}
            className="mx-auto"
          >
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={barKey} fill="#6d45a4" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default EarningsOverview;
