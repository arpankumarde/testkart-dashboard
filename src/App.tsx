import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import AppRouter from "./AppRouter";
import { ProvideAuth } from "./hooks/useAuth";
import { Header, Sidebar } from "./components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const App = () => {
  const [navState, setNavState] = useState<boolean>(false);

  useEffect(() => {
    setNavState(isMobile ? false : true);
  }, []);

  return (
    <ProvideAuth>
      <div className="h-dvh">
        <Header {...{ navState, setNavState }} />
        <div className="flex">
          <Sidebar {...{ navState, setNavState }} />
          <div className="bg-gray-200 h-[calc(100dvh-4rem)] w-full overflow-auto">
            {isMobile ? navState ? null : <AppRouter /> : <AppRouter />}
          </div>
        </div>
      </div>
      <ToastContainer />
    </ProvideAuth>
  );
};

export default App;
