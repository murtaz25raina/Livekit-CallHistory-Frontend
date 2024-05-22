import { FC, ChangeEvent } from "react";
import "./Input.css";
import SendButton from "../SendButton/SendButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/app/store";
import { selectCurrentRoomState } from "../../../redux/stores/currentRoom/currentRoomSlice";
import {
  selectMessageState,
  setMessage,
} from "../../../redux/stores/message/messageSlice";
import { useClientContext } from "../../../providers/ClientProvider";
import { ReceiptType } from "matrix-js-sdk";
import { useTypingIndicator } from "../../../hooks/useTypingIndicator";

interface InputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({ value, onChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentRoomId, currentRoom } = useSelector(selectCurrentRoomState);
  const { message } = useSelector(selectMessageState);
  const { client } = useClientContext();
  const sendType = useTypingIndicator(client, currentRoomId);
  const sendMessage = async () => {
    sendType(false);
    await client?.sendEvent(currentRoomId, "m.room.message", {
      msgtype: "m.text",
      body: message,
    });

    const lastEvent = currentRoom?.getLastLiveEvent();
    const lastEventId = lastEvent?.getId();
    if (lastEvent && lastEventId) {
      await client.sendReceipt(lastEvent, ReceiptType.Read);
      await client.setRoomReadMarkers(currentRoomId, lastEventId);
    }
    dispatch(setMessage(""));
    const messageContainer = document.getElementById("messages-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
      messageContainer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };
  return (
    <div className="chat-input-field-container group">
      <input
        type="text"
        className="chat-input-field"
        value={value}
        onChange={onChange}
        placeholder="Type a message..."
        onKeyDown={handleKeyDown}
      />
      <SendButton sendMessage={sendMessage} />
    </div>
  );
};

export default Input;
