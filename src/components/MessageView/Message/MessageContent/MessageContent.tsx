import React, { FC, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { getLocalStorage } from "../../../../helpers/localStorage";
import "./MessageContent.css";
import { IContent, MatrixEvent } from "matrix-js-sdk";
import { IoIosCall } from "react-icons/io";

interface MessageContentProps {
  messageBody: string | undefined;
  senderId: string;
  message: MatrixEvent;
  eventId: string;
  content: IContent | undefined;
}

const MessageContent: FC<MessageContentProps> = ({
  messageBody,
  senderId,
  message,
  eventId,
  content,
}) => {
  const userId = getLocalStorage("user_id");
  const isOwnMessage = senderId === userId;
  const isEdited = message.replacingEvent();
  const editedMessage = isEdited?.getContent()["m.new_content"]?.body;

  console.log("Message type --", message.getType());

  return (
    <div
      className={`message-content-container ${
        isOwnMessage ? "bg-[#ecf0f8]" : "bg-white"
      }`}
    >
      {message.isRedacted() && message.getType() === "m.room.message" ? (
        <span className="flex gap-2 items-center">
          <RiDeleteBinLine /> Message Deleted
        </span>
      ) : (
        <span className="text-base">
          {isEdited ? editedMessage : messageBody}
        </span>
      )}
      {message.getType() === "m.call.hangup" && (
        <div className="flex gap-x-3 justify-center items-center text-[#343a40]">
          <IoIosCall className="w-7 h-7" />
          <span className="text-[15px] font-[PublicSans]">Call Ended</span>
        </div>
      )}
    </div>
  );
};

export default MessageContent;
