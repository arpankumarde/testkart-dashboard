import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks";
import { isMobile } from "react-device-detect";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { PiUserCircle } from "react-icons/pi";
import {
  IoLogOutOutline,
  IoSettingsOutline,
  IoTicketOutline,
} from "react-icons/io5";

const Sidebar = ({ navState, setNavState }) => {
  const { user, logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    handleMobileNavCollapse();
    logout();
  };

  const handleMobileNavCollapse = () => {
    isMobile ? setNavState(false) : null;
  };

  return (
    user && (
      <nav
        className={
          navState
            ? `w-full h-[calc(100dvh-4rem)] md:w-64 bg-green-10 absolute md:static left-0 text-gray-600 bg-white`
            : `hidden`
        }
      >
        <div className="w-full [&>h2]:text-gray-800 [&>h2]:px-4 [&>h2]:pb-2 [&>h2]:mt-4">
          <h2>Studio</h2>
          <div className="flex flex-col [&>*]:inline-flex [&>*]:items-center [&>*]:gap-2 [&>*]:pl-10 [&>*]:py-4 md:[&>*]:py-2">
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
              to="/earnings/overview"
              onClick={handleMobileNavCollapse}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <MdOutlineCurrencyRupee size={20} />
              Earnings
            </NavLink>
          </div>
          <h2>Settings</h2>
          <div className="flex flex-col [&>*]:inline-flex [&>*]:items-center [&>*]:gap-2 [&>*]:pl-10 [&>*]:py-4 md:[&>*]:py-2">
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
              className="hover:bg-red-100 text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <IoLogOutOutline size={20} />
              Logout
            </button>
            <NavLink
              to="/support"
              onClick={handleMobileNavCollapse}
              className="hover:bg-gray-100 hover:text-gray-950"
            >
              <IoTicketOutline size={20} />
              Support
            </NavLink>
          </div>
        </div>
      </nav>
    )
  );
};

export default Sidebar;
