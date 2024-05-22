import { FC } from "react";
import Input from "../Input/Input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/app/store";
import {
  selectMessageState,
  setMessage,
} from "../../../redux/stores/message/messageSlice";
import "./InputBox.css";
import { selectCurrentRoomState } from "../../../redux/stores/currentRoom/currentRoomSlice";
import { useTypingIndicator } from "../../../hooks/useTypingIndicator";
import { useClientContext } from "providers/ClientProvider";

const InputBox: FC = () => {
  const { message } = useSelector(selectMessageState);
  const { client } = useClientContext();
  const { currentRoomId } = useSelector(selectCurrentRoomState);
  const dispatch = useDispatch<AppDispatch>();
  const sendType = useTypingIndicator(client, currentRoomId);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMessage(e.target.value));
    sendType(true);
  };

  return (
    <div className="chat-input-container">
      <Input value={message} onChange={handleInputChange} />
    </div>
  );
};

export default InputBox;
