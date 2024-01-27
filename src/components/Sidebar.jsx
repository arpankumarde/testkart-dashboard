import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks";
import { isMobile } from "react-device-detect";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { PiUserCircle } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import {
  IoPeopleOutline,
  IoLogOutOutline,
  IoSettingsOutline,
  IoTicketOutline,
} from "react-icons/io5";

const Sidebar = ({ navState, setNavState }) => {
  let { user, logout } = useAuth();
  user = JSON.parse(user);

  const handleLogout = (e) => {
    e.preventDefault();
    handleMobileNavCollapse();
    logout();
  };

  const handleMobileNavCollapse = () => {
    isMobile ? setNavState(false) : null;
    FreshworksWidget("close");
  };

  const handleSupportRequest = (e) => {
    e.preventDefault();
    handleMobileNavCollapse();
    FreshworksWidget("show");
    FreshworksWidget("open");
  };

  return (
    user && (
      <nav
        className={
          navState
            ? `w-full h-[calc(100dvh-4rem)] z-50 md:w-64 bg-green-10 absolute md:static left-0 text-gray-600 bg-white`
            : `hidden`
        }
      >
        <div className="w-full [&>h2]:text-gray-800 [&>h2]:px-4 [&>h2]:pb-2 [&>h2]:mt-4">
          <h2 className="capitalize font-semibold">
            Hi {user?.academy.academy_name}!
          </h2>
          <hr className="my-2" />
          <div
            id="navlinks-container"
            className="flex flex-col [&>*]:inline-flex [&>*]:items-center [&>*]:gap-2 [&>*]:pl-10 [&>*]:py-4 md:[&>*]:py-2"
          >
            <NavLink
              to="/"
              onClick={handleMobileNavCollapse}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <LuLayoutDashboard size={20} />
              Dashboard
            </NavLink>
            <NavLink
              to="/test-series"
              onClick={handleMobileNavCollapse}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <HiOutlineDocumentText size={20} />
              Test Series
            </NavLink>
            <NavLink
              to="/test-reports"
              onClick={handleMobileNavCollapse}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <HiOutlineDocumentReport size={20} />
              Test Reports
            </NavLink>
            <NavLink
              to="/students"
              onClick={handleMobileNavCollapse}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <IoPeopleOutline size={20} />
              Students
            </NavLink>
            <NavLink
              to="/earnings/overview"
              onClick={handleMobileNavCollapse}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <MdOutlineCurrencyRupee size={20} />
              Earnings
            </NavLink>
            <NavLink
              to="/notifications"
              onClick={handleMobileNavCollapse}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <IoMdNotificationsOutline size={20} />
              Notifications
            </NavLink>
            <NavLink
              to="/profile"
              onClick={handleMobileNavCollapse}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <PiUserCircle size={20} />
              Profile
            </NavLink>
            <NavLink
              to="/settings"
              onClick={handleMobileNavCollapse}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <IoSettingsOutline size={20} />
              Settings
            </NavLink>
          </div>
          <hr className="my-4" />
          <div className="flex flex-col [&>*]:inline-flex [&>*]:items-center [&>*]:gap-2 [&>*]:pl-10 [&>*]:py-4 md:[&>*]:py-2">
            <button
              type="button"
              onClick={handleLogout}
              className="hover:bg-red-100 text-red-600 hover:text-red-700"
            >
              <IoLogOutOutline size={20} />
              Logout
            </button>
            <button
              type="button"
              onClick={handleSupportRequest}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <IoTicketOutline size={20} />
              Support
            </button>
          </div>
        </div>
      </nav>
    )
  );
};

export default Sidebar;
