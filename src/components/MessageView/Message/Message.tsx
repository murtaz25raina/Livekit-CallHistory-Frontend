import { FC, useCallback, useMemo, useState } from "react";
import { MatrixEvent } from "matrix-js-sdk";
import MessageContent from "./MessageContent/MessageContent";
import Avatar from "./Avatar/Avatar";
import MessageInfo from "./MessageInfo/MessageInfo";
import { usePresenceContext } from "../../../providers/PresenceProvider";
import { getLocalTime } from "../../../helpers/messageTime";
import MessagePopupMenu from "../../MessagePopupMenu/MessagePopupMenu";
import { getLocalStorage } from "../../../helpers/localStorage";
import { FiMoreHorizontal } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/app/store";
import {
  selectMessagePopupState,
  setShowMore,
  setViewMessagePopup,
} from "../../../redux/stores/messagePopup/messagePopup";
import "./Message.css";
import { useClientContext } from "../../../providers/ClientProvider";
import EditMessage from "../EditMessage/EditMessage";

interface MessageProps {
  message: MatrixEvent;
}

const Message: FC<MessageProps> = ({ message }) => {
  const { content, origin_server_ts, sender } = message.event;
  const { client } = useClientContext();
  const dispatch = useDispatch<AppDispatch>();
  const { viewMessagePopup, showMore } = useSelector(selectMessagePopupState);
  const senderId = sender as string;
  const userId = getLocalStorage("user_id");
  const { presence } = usePresenceContext();
  const status = presence.includes(senderId);
  const messageBody = content?.body;
  const messageTime = getLocalTime(origin_server_ts as number);
  const eventId = message.event.event_id as string;
  const isOwnMessage = senderId === userId;
  const displayName = client.getUser(senderId)?.displayName || "";
  const nameFirstLetter = displayName!.charAt(0).toUpperCase();
  const [editing, setEditing] = useState<boolean>(false);
  const renderElement = useMemo(
    () =>
      viewMessagePopup === eventId && !message.isRedacted() ? (
        <MessagePopupMenu eventId={eventId} setEditing={setEditing} />
      ) : null,
    [viewMessagePopup, eventId, message]
  );

  const handleMoreIconClick = useCallback(() => {
    dispatch(setViewMessagePopup(eventId));
  }, [eventId, dispatch]);

  const renderMoreElement = useMemo(
    () =>
      showMore === eventId ? (
        <FiMoreHorizontal
          className="message-menu-more-icon"
          onClick={handleMoreIconClick}
        />
      ) : null,
    [showMore, eventId, handleMoreIconClick]
  );

  const onMouseEnter = useCallback(() => {
    dispatch(setShowMore(eventId));
  }, [eventId, dispatch]);

  const onMouseLeave = useCallback(() => {
    dispatch(setShowMore(""));
  }, [dispatch]);

  return (
    <div
      className="flex relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div>
        <MessageInfo
          name={displayName}
          messageTime={messageTime}
          senderId={senderId}
          message={message}
        />
        <div className="flex gap-2">
          {!isOwnMessage ? (
            <Avatar nameFirstLetter={nameFirstLetter} status={status} />
          ) : null}
          {editing ? (
            <EditMessage
              setEditing={setEditing}
              messageBody={messageBody}
              event={message.event}
              message={message}
            />
          ) : (
            <MessageContent
              messageBody={messageBody}
              senderId={senderId}
              content={content}
              eventId={eventId}
              message={message}
            />
          )}
        </div>
      </div>
      {renderElement}
      {renderMoreElement}
    </div>
  );
};

export default Message;
