import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../Menu/Menu";
import RoomListPopupMenu from "../../RoomListPopupMenu/RoomListPopupMenu";
import { Room, RoomEvent } from "matrix-js-sdk";
import { getLocalStorage } from "../../../helpers/localStorage";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentRoomState,
  setCurrentRoom,
  setCurrentRoomId,
} from "../../../redux/stores/currentRoom/currentRoomSlice";
import { AppDispatch } from "../../../redux/app/store";
import {
  selectRoomTilePopupState,
  setShowMore,
} from "../../../redux/stores/roomTilePopup/roomTilePopupSlice";
import "./RoomTile.css";
import Avatar from "../../Avatar/Avatar";
import { useTypingIndicatorContext } from "../../../providers/TypingIndicatorProvider";
import TypingIndicator from "../../TypingIndicator/TypingIndicator";

interface RoomTileProps {
  room: Room;
  roomId: string;
}

const RoomTile: FC<RoomTileProps> = ({ room, roomId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentRoomId } = useSelector(selectCurrentRoomState);
  const { viewRoomTilePopup } = useSelector(selectRoomTilePopupState);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const { typingUsers } = useTypingIndicatorContext();

  useEffect(() => {
    const updateLastMessage = () => {
      const newLastMessage = room.getLastLiveEvent();
      const isEdited = newLastMessage?.getContent()["m.new_content"];
      const editedMessage = isEdited?.body;
      const content = isEdited
        ? editedMessage
        : newLastMessage?.getContent().body;
      setLastMessage(content);
    };
    updateLastMessage();
    const subscription = room.on(RoomEvent.Timeline, updateLastMessage);
    return () => {
      subscription.off(RoomEvent.Timeline, updateLastMessage);
    };
  }, [room]);

  const onMouseEnter = useCallback(() => {
    dispatch(setShowMore(room.roomId));
  }, [room.roomId, dispatch]);

  const onMouseLeave = useCallback(() => {
    dispatch(setShowMore(""));
  }, [dispatch]);

  const onClick = () => {
    dispatch(setCurrentRoomId(room.roomId));
    navigate(`/chat/${room.roomId}`, { state: room.roomId });
  };

  const isCurrentRoom = useMemo(
    () => currentRoomId === room.roomId,
    [currentRoomId, room.roomId]
  );

  const renderElement = useMemo(() => {
    return viewRoomTilePopup === roomId ? (
      <RoomListPopupMenu roomId={room.roomId} />
    ) : null;
  }, [viewRoomTilePopup, room.roomId, roomId]);

  useEffect(() => {
    setCurrentRoomId(getLocalStorage("current_room") as string);
  }, []);

  useEffect(() => {
    dispatch(setCurrentRoom(room));
  }, [dispatch, room]);

  return (
    <div
      className={`room-tile-container ${isCurrentRoom && "bg-white"}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* <div
        className="room-tile-avatar-container"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      > */}
      <div className="room-tile-avatar-container" onClick={onClick}>
        <Avatar name={room.name} />
        <div className="room-list-avatar-content">
          <span>{room.name}</span>
          {isCurrentRoom && typingUsers.length > 0 ? (
            <TypingIndicator typingUsers={typingUsers} />
          ) : (
            lastMessage && <span>{lastMessage}</span>
          )}
        </div>
      </div>
      <Menu room={room} roomId={room.roomId} />
      {/* </div> */}
      {renderElement}
    </div>
  );
};

export default RoomTile;
