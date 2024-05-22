import { FC, useEffect, useState } from "react";
import { Room, RoomEvent } from "matrix-js-sdk";
import "./Avatar.css";

interface AvatarProps {
  room: Room;
}

const Avatar: FC<AvatarProps> = ({ room }) => {
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    const updateLastMessage = () => {
      const newLastMessage = room.getLastLiveEvent()?.getContent().body;
      setLastMessage(newLastMessage);
    };
    updateLastMessage();
    const subscription = room.on(RoomEvent.Timeline, updateLastMessage);
    return () => {
      subscription.off(RoomEvent.Timeline, updateLastMessage);
    };
  }, [room]);

  const avatarInitial = room.name.charAt(0).toUpperCase();

  return (
    <div className="room-list-avatar-container">
      <div className="room-list-avatar-wrapper">
        <span className="room-list-avatar">{avatarInitial}</span>
      </div>
      <div className="room-list-avatar-content">
        <div>{room.name}</div>
        {lastMessage && (
          <div className="room-list-avatar-message">{lastMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
