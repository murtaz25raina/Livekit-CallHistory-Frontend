import { FC, useCallback, useEffect, useMemo } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { Room } from "matrix-js-sdk";
import { getLocalTime } from "../../../helpers/messageTime";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/app/store";
import {
  selectRoomTilePopupState,
  setViewRoomTilePopup,
} from "../../../redux/stores/roomTilePopup/roomTilePopupSlice";
import "./Menu.css";
import {
  selectNotificationState,
  setRoomNotification,
} from "../../../redux/stores/Notification/Notification";
import { selectMessageState } from "../../../redux/stores/message/messageSlice";

interface MenuProps {
  room: Room;
  roomId: string;
}

const Menu: FC<MenuProps> = ({ room, roomId }) => {
  const { showMore } = useSelector(selectRoomTilePopupState);
  const dispatch = useDispatch<AppDispatch>();
  const handleMoreIconClick = useCallback(() => {
    dispatch(setViewRoomTilePopup(roomId));
  }, [roomId, dispatch]);

  const lastLiveEvent = room.getLastLiveEvent();
  const lastMessageTime = lastLiveEvent
    ? getLocalTime(lastLiveEvent.localTimestamp as number)
    : "";
  const msgType = lastLiveEvent?.getContent().msgtype;
  const { roomsNotification } = useSelector(selectNotificationState);
  const unreadNotificationCount = room.getUnreadNotificationCount();

  const renderContent = useMemo(() => {
    if (showMore === room.roomId) {
      return (
        <FiMoreHorizontal
          className="room-list-menu-more-icon"
          onClick={handleMoreIconClick}
        />
      );
    } else {
      return (
        <>
          <span className="room-list-menu-text">{lastMessageTime}</span>
          {msgType && unreadNotificationCount > 0 && (
            <div className="room-list-menu-notification-badge">
              <span>{unreadNotificationCount}</span>
            </div>
          )}
        </>
      );
    }
  }, [
    room,
    showMore,
    lastMessageTime,
    msgType,
    unreadNotificationCount,
    handleMoreIconClick,
  ]);

  return <div className="room-list-menu-container">{renderContent}</div>;
};

export default Menu;
