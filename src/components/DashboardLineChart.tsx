import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface EarningsGraph {
  month: string;
  income: number;
}

interface DashboardLineChartProps {
  data?: EarningsGraph[];
  xKey: string;
  line: string;
}

const DashboardLineChart = ({
  data = [],
  xKey = "",
  line = "",
}: DashboardLineChartProps) => {
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="5 5" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey={line}
        stroke="#6d45a4"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
};

export default DashboardLineChart;
