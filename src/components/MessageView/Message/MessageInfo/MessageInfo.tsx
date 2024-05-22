import React, { FC } from "react";
import { getLocalStorage } from "../../../../helpers/localStorage";
import "./MessageInfo.css";
import { MatrixEvent } from "matrix-js-sdk";
import { getLocalTime } from "../../../../helpers/messageTime";

interface MessageInfoProps {
  name: string;
  messageTime: string;
  senderId: string;
  message: MatrixEvent;
}

const MessageInfo: FC<MessageInfoProps> = ({
  name,
  messageTime,
  senderId,
  message,
}) => {
  const userId = getLocalStorage("user_id");
  const isOwnMessage = senderId === userId;
  const isEdited = message.replacingEvent();
  const editTime =
    isEdited?.getDate()?.toDateString() +
    " " +
    getLocalTime(isEdited?.getDate()?.getTime());

  return (
    <div className="message-info-container">
      {!isOwnMessage && <span className="message-sender-info">{name}</span>}
      <div className="flex gap-2 items-center">
        <span className="message-sent-time">{messageTime}</span>
        {isEdited && (
          <span className="message-edit-time" title={editTime}>
            edited
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageInfo;
