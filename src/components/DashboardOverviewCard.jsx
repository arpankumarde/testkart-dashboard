import { GoArrowUp, GoArrowDown } from "react-icons/go";

const DashboardOverviewCard = ({
  name,
  icon,
  prev,
  trend,
  up,
  total,
  last,
}) => {
  return (
    <div className="w-full md:w-[48%] lg:w-[23%] shadow-lg rounded-md border border-[#6d45a4] bg-[#6d45a4]">
      <div className="flex justify-between rounded-t-md items-center  text-white font-bold uppercase p-4">
        <h3>{name}</h3>
        {icon}
      </div>
      <div className="p-4 bg-gray-50 rounded-b-md text-gray-600">
        <div className="text-xs">
          <span
            className={`text-white px-1 rounded-sm
          ${up ? "bg-[#54cc96]" : "bg-[#ff5560]"}
          `}
          >
            {prev}
          </span>{" "}
          <span>From previous period</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center text-lg font-semibold text-gray-600">
            {trend}
            {up ? (
              <GoArrowUp size={20} color="#54cc96" />
            ) : (
              <GoArrowDown size={20} color="#ff5560" />
            )}
          </div>
          <div className="text-xs">
            {total ? `Total: ${total}` : `Last: ${last}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewCard;
