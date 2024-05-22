import { FC } from "react";
import "./Avatar.css";

interface AvatarProps {
  nameFirstLetter: string | undefined;
  status: boolean;
}

const Avatar: FC<AvatarProps> = ({ nameFirstLetter, status }) => {
  return (
    <div>
      <div className="message-avatar-circle">
        <span className="message-text-xl">{nameFirstLetter}</span>
        <span
          className={`message-status-indicator ${
            status ? "message-online" : "message-offline"
          }`}
        ></span>
      </div>
    </div>
  );
};

export default Avatar;
