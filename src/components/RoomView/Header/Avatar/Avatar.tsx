import { FC } from "react";
import "./Avatar.css";

interface AvatarProps {
  roomName: string;
}

const Avatar: FC<AvatarProps> = ({ roomName }) => {
  const firstLetter = roomName?.charAt(0).toUpperCase();
  return (
    <div className="room-list-avatar-wrapper">
      <span className="room-list-avatar">{firstLetter}</span>
    </div>
  );
};

export default Avatar;
