import { FC } from "react";
import "./Avatar.css";

interface AvatarProps {
  name: string;
  image?: {
    src: string;
    alt?: string;
  };
}

const Avatar: FC<AvatarProps> = ({ name, image }) => {
  const initialLetter = name.charAt(0).toUpperCase();
  return (
    <div className="avatar-container">
      {image?.src ? (
        <img className="avatar-img" src={image.src} alt={name} />
      ) : (
        <span className="avatar-content">{initialLetter}</span>
      )}
    </div>
  );
};

export default Avatar;
