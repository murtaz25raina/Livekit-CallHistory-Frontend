import { FC } from "react";
import { Send24Regular } from "@fluentui/react-icons";
import "./SendButton.css";

interface SendButtonProps {
  sendMessage: () => Promise<void>;
}
const SendButton: FC<SendButtonProps> = ({ sendMessage }) => {
  return (
    <button
      title="Send"
      type="button"
      className="chat-send-button"
      onClick={sendMessage}
    >
      <Send24Regular />
    </button>
  );
};

export default SendButton;
