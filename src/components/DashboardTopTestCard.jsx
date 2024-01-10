const DashboardTopTestCard = ({ img, title }) => {
  return (
    <>
      <div className="flex items-center gap-2 h-20 hover:bg-gray-100 px-1">
        <img
          src={img}
          alt="Card"
          className="object-cover w-20 aspect-video bg-gray-100 rounded-sm"
        />
        <div className="flex-1">
          <h2 className="">{title}</h2>
        </div>
      </div>
      <hr />
    </>
  );
};

export default DashboardTopTestCard;
