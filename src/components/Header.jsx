import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";
import { RiMenu2Fill } from "react-icons/ri";
import { IoAdd } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";
import { useEffect } from "react";

const Header = ({ navState, setNavState }) => {
  const { user, logout } = useAuth();
  const path = useLocation().pathname.split("/")[1];

  const handleNavToggle = () => {
    setNavState((prev) => !prev);
  };

  useEffect(() => {
    if (path.toLowerCase() === "login") logout();
    else if (path.toLowerCase() === "signup") logout(false);
  }, [path]);

  return (
    <header className="flex justify-between gap-2 items-center sticky top-0 w-full h-16 px-2 border-b md:border-none drop-shadow-lg bg-white">
      <div className="flex items-center w-max gap-1 md:gap-4">
        {user && (
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition ease-in-out"
            onClick={handleNavToggle}
          >
            {!navState ? (
              <RiMenu2Fill size="25" />
            ) : (
              <VscChromeClose size="25" />
            )}
          </button>
        )}
        <NavLink to="/">
          <img
            src="/static/images/testkart-app-logo.png"
            alt="TestKart | Teacher's App"
            className="h-16"
          />
        </NavLink>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <Link
            to="/test-series/add"
            className="hidden md:flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition ease-in-out"
          >
            <IoAdd size={20} />
            Test Series
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
