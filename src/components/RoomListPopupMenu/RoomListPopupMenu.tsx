import { FC } from "react";
import { RiDoorOpenFill, RiSettingsFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useClientContext } from "../../providers/ClientProvider";
import { AppDispatch } from "../../redux/app/store";
import { setViewRoomTilePopup } from "../../redux/stores/roomTilePopup/roomTilePopupSlice";
import "./RoomListPopupMenu.css";
import { useModel } from "providers/useModalProvider";

interface RoomListPopupMenuProps {
  roomId: string;
}

const RoomListPopupMenu: FC<RoomListPopupMenuProps> = ({ roomId }) => {
  const { client } = useClientContext();
  const dispatch = useDispatch<AppDispatch>();
  const { setRoomSettingModalIsOpen } = useModel();

  const handleMouseLeave = () => {
    dispatch(setViewRoomTilePopup(""));
  };
  const handleDelete = async () => {
    await client?.leave(roomId);
  };

  return (
    <div className="room-popup" onMouseLeave={handleMouseLeave}>
      <button type="button" className="room-popup-btn" onClick={handleDelete}>
        <RiDoorOpenFill className="room-popup-icon-danger" />
        <span className="room-popup-leave-option">Leave</span>
      </button>
      <button
        type="button"
        className="room-popup-btn"
        onClick={() => {
          setRoomSettingModalIsOpen(true);
        }}
      >
        <RiSettingsFill className="text-gray-800 w-5 h-5" />
        <span className=" text-blue-800">Settings</span>
      </button>
    </div>
  );
};

export default RoomListPopupMenu;
