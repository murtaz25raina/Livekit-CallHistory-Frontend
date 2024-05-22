import { FC, Dispatch, SetStateAction, useState } from "react";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";
import { IEvent, MatrixEvent } from "matrix-js-sdk";
import "./EditMessage.css";
import { useClientContext } from "../../../providers/ClientProvider";
import { getLocalStorage } from "../../../helpers/localStorage";
import { useTypingIndicator } from "../../../hooks/useTypingIndicator";
import { useSelector } from "react-redux";
import { selectCurrentRoomState } from "../../../redux/stores/currentRoom/currentRoomSlice";

interface EditMessageProps {
  setEditing: Dispatch<SetStateAction<boolean>>;
  messageBody: string;
  event: Partial<IEvent>;
  message: MatrixEvent;
}

const EditMessage: FC<EditMessageProps> = ({
  setEditing,
  messageBody,
  event,
  message,
}) => {
  const isEdited = message.replacingEvent();
  const editedMessage = isEdited
    ? isEdited?.getContent()["m.new_content"]?.body
    : messageBody;
  const [newMessage, setNewMessage] = useState<string>(editedMessage);
  const { client } = useClientContext();
  const { currentRoomId } = useSelector(selectCurrentRoomState);
  const sendType = useTypingIndicator(client, currentRoomId);

  const editMessage = async () => {
    if (!client) return;
    sendType(false);
    const roomId = getLocalStorage("current_room") as string;
    try {
      const newContent = {
        body: `* ${newMessage}`,
        msgtype: "m.text",
        "m.new_content": {
          body: newMessage,
          msgtype: "m.text",
          "m.mentions": {},
        },
        "m.mentions": {},
        "m.relates_to": {
          rel_type: "m.replace",
          event_id: event.event_id,
        },
      };
      await client.sendEvent(roomId, "m.room.message", newContent);
      setEditing(false);
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      editMessage();
    }
  };
  return (
    <div className="flex flex-col">
      <input
        type="text"
        className="message-edit-input"
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
          sendType(true);
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="message-option-action-container"
          onClick={() => {
            setEditing(false);
          }}
        >
          <IoMdClose className="message-edit-icon" />
        </button>
        <button
          type="button"
          className="message-option-action-container"
          onClick={editMessage}
        >
          <IoMdCheckmark className="message-edit-icon" />
        </button>
      </div>
    </div>
  );
};

export default EditMessage;
