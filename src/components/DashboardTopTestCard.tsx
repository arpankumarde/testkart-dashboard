import PropTypes from "prop-types";

const DashboardTopTestCard = ({ img = "", title = "" }) => {
  return (
    <div className="flex items-center gap-2 h-20 hover:bg-gray-100 px-4 lg:px-1 border-b">
      <img
        src={img}
        alt="Card"
        className="object-cover w-20 aspect-video bg-gray-100 rounded-sm"
      />
      <div className="flex-1">
        <h2>{title}</h2>
      </div>
    </div>
  );
};

DashboardTopTestCard.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string,
};

export default DashboardTopTestCard;
