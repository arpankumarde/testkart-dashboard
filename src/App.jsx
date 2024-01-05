import React from "react";
import AppRouter from "./AppRouter";
import { Footer, Header, Sidebar } from "./components";

const App = () => {
  return (
    <React.Fragment>
      <Header />
      <Sidebar />
      <AppRouter />
      <Footer />
    </React.Fragment>
  );
};

export default App;
