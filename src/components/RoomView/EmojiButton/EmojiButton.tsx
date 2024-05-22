import { FC } from "react";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import "./EmojiButton.css";

const EmojiButton: FC = () => {
  return (
    <div className="chat-emoji-button" title="Emoji">
      <BsFillEmojiSmileFill />
    </div>
  );
};

export default EmojiButton;
