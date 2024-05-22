import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import useRoom from "../../../../hooks/useRoom";
import { useDispatch } from "react-redux";
import { setCurrentRoomId } from "../../../../redux/stores/currentRoom/currentRoomSlice";
import { AppDispatch } from "../../../../redux/app/store";
import "./RoomInfo.css";
import Avatar from "../../../Avatar/Avatar";
import environment from "environments/environments";

const RoomInfo: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const room = useRoom();
  const roomName = room?.name || "";
  const avatarUrl = room?.getAvatarUrl(
    environment.baseURL,
    32,
    32,
    "crop"
  ) as string;

  useEffect(() => {
    if (id) dispatch(setCurrentRoomId(id));
  }, [id, dispatch]);

  return (
    <div className="chat-room-info-container">
      <Avatar name={roomName} image={{ src: avatarUrl }} />
      <span className="chat-room-username">{roomName}</span>
    </div>
  );
};

export default RoomInfo;
