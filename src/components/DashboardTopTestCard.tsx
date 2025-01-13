import { Link } from "react-router-dom";

interface DashboardTopTestCardProps {
  img?: string;
  title: string;
  hash?: string;
  desc?: string;
}

const DashboardTopTestCard = ({
  img = "",
  title = "",
  hash,
}: DashboardTopTestCardProps) => {
  return (
    <Link
      to={`https://testkart.in/test-series/${hash}`}
      target="_blank"
      className="flex items-center gap-2 h-20 hover:bg-gray-100 px-4 lg:px-1 border-b"
    >
      <img
        src={img ?? ""}
        alt="Card"
        className="object-cover w-20 aspect-video bg-gray-100 rounded-sm"
      />
      <div className="flex-1">
        <h2>{title ?? "NA"}</h2>
      </div>
    </Link>
  );
};

export default DashboardTopTestCard;
