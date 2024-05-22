import { FC } from "react";
import { useClientContext } from "../../providers/ClientProvider";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/app/store";
import { setViewMessagePopup } from "../../redux/stores/messagePopup/messagePopup";
import { selectCurrentRoomState } from "../../redux/stores/currentRoom/currentRoomSlice";
import "./MessagePopupMenu.css";
import { updateMessage } from "../../redux/stores/message/messageSlice";

interface MessagePopupMenuProps {
  eventId: string;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const MessagePopupMenu: FC<MessagePopupMenuProps> = ({
  eventId,
  setEditing,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { client } = useClientContext();
  const { currentRoomId } = useSelector(selectCurrentRoomState);

  const handleMouseLeave = () => {
    dispatch(setViewMessagePopup(""));
  };

  const handleDelete = async () => {
    try {
      await client.redactEvent(currentRoomId, eventId);
    } catch (error) {
      console.error(`Error deleting message: ${eventId}`, error);
    }
    const event = await client.fetchRoomEvent(currentRoomId, eventId);
    dispatch(updateMessage({ eventId: eventId, event: event }));
  };

  const handleEdit = () => {
    setEditing(true);
  };

  return (
    <div className="message-popup" onMouseLeave={handleMouseLeave}>
      <button type="button" className="message-popup-btn" onClick={handleEdit}>
        <MdOutlineModeEdit className="message-popup-icon" />
        <span className="message-popup-option">Edit</span>
      </button>
      <button
        type="button"
        className="message-popup-btn"
        onClick={handleDelete}
      >
        <RiDeleteBinLine className="message-popup-icon-danger" />
        <span className="message-popup-delete-option">Delete</span>
      </button>
    </div>
  );
};

export default MessagePopupMenu;
