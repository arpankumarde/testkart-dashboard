import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GoArrowUp, GoArrowDown } from "react-icons/go";

const DashboardOverviewCard = ({
  name = "",
  icon = Object,
  cardData = {},
  timeframe = "month",
}) => {
  const [data, setData] = useState(cardData?.monthly);

  useEffect(() => {
    switch (timeframe) {
      case "week":
        setData(cardData?.weekly);
        break;
      case "month":
        setData(cardData?.monthly);
        break;
      case "year":
        setData(cardData?.yearly);
        break;
      default:
        setData(cardData?.monthly);
        break;
    }
  }, [timeframe, cardData]);

  return (
    <div className="w-full md:w-[48%] lg:w-[23%] shadow-lg rounded-md border border-[#6d45a4] bg-[#6d45a4]">
      <div className="flex justify-between rounded-t-md items-center text-white font-bold uppercase p-4">
        <h3>{name}</h3>
        {icon}
      </div>
      <div className="p-4 bg-gray-50 rounded-b-md text-gray-600">
        <div className="text-xs">
          <span
            className={`text-[#6d45a4] px-1 rounded-sm
          ${
            data?.change != 0 &&
            (data?.change > 0
              ? "bg-[#54cc96] text-white"
              : "bg-[#ff5560] text-white")
          }
          `}
          >
            {data?.change ?? 0}%
          </span>{" "}
          <span>From previous {timeframe}</span>
        </div>
        <hr className="my-4" />
        <div className="flex gap-1 items-center text-lg font-semibold text-gray-600 overflow-hidden">
          {data?.total ? data?.total : 0}
          {data?.change != 0 &&
            (data?.change > 0 ? (
              <GoArrowUp size={20} color="#54cc96" />
            ) : (
              <GoArrowDown size={20} color="#ff5560" />
            ))}
        </div>
      </div>
    </div>
  );
};

DashboardOverviewCard.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.object,
  cardData: PropTypes.object,
  timeframe: PropTypes.string,
};

export default DashboardOverviewCard;
