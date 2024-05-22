import { FC } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/app/store";
import { setIsCreateRoomModelOpen } from "../../../redux/stores/createRoomModal/createRoomModalSlice";
import "./Header.css";

const Header: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleCreateRoomClick = () => {
    dispatch(setIsCreateRoomModelOpen(true));
  };

  return (
    <div className="room-list-header-container">
      <div className="room-list-header-section">
        <IoIosArrowDown className="room-list-header-icon" />
        <span className="room-list-header-title">Rooms</span>
      </div>
      <div className="room-list-icon-wrapper">
        <FiMoreHorizontal className="room-list-header-icon room-list-more-icon" />
        <AiOutlinePlus
          className="room-list-header-icon room-list-plus-icon"
          onClick={handleCreateRoomClick}
        />
      </div>
    </div>
  );
};

export default Header;
