import { FC } from "react";
import RoomInfo from "../Header/RoomInfo/RoomInfo";
import Actions from "../Header/Actions/Actions";
import "./Header.css";

const Header: FC = () => {
  return (
    <header className="chat-room-header">
      <RoomInfo />
      <Actions />
    </header>
  );
};

export default Header;
