import { FC } from "react";
import { Outlet } from "react-router-dom";
import "./Main.css";
const Main: FC = () => {
  return (
    <main className="main-container">
      <Outlet />
    </main>
  );
};

export default Main;
