import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import AppRouter from "./AppRouter";
import { Footer, Header, Sidebar } from "./components";

const App = () => {
  const [navState, setNavState] = useState(isMobile ? false : true);

  return (
    <div className="h-dvh">
      <Header {...{ navState, setNavState }} />
      <div className="flex">
        <Sidebar {...{ navState, setNavState }} />
        <div className="bg-gray-200 h-[calc(100dvh-4rem)] w-full overflow-auto">
          {isMobile ? navState ? null : <AppRouter /> : <AppRouter />}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
