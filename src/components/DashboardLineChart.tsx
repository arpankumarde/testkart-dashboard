import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DashboardLineChart = ({ data = [], xKey = "", line = "" }) => {
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

DashboardLineChart.propTypes = {
  data: PropTypes.array,
  xKey: PropTypes.string,
  line: PropTypes.string,
};

export default DashboardLineChart;
