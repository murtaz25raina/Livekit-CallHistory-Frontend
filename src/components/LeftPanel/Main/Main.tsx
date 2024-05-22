import { FC } from "react";
import RoomList from "../../RoomList/RoomList";
import "./Main.css";

const Main: FC = () => {
  return (
    <main className="left-panel-main-container">
      <RoomList />
    </main>
  );
};

export default Main;
