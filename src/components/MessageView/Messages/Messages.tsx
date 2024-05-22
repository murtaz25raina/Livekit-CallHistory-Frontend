import { FC, useEffect, useRef } from "react";
import { getLocalStorage } from "../../../helpers/localStorage";
import { MatrixEvent, ReceiptType, Room, RoomEvent } from "matrix-js-sdk";
import Message from "../Message/Message";
import { useClientContext } from "../../../providers/ClientProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  selectMessageState,
  setMessages,
} from "../../../redux/stores/message/messageSlice";
import { selectCurrentRoomState } from "../../../redux/stores/currentRoom/currentRoomSlice";
import "./Messages.css";
import TypingIndicator from "../../TypingIndicator/TypingIndicator";
import { useTypingIndicatorContext } from "../../../providers/TypingIndicatorProvider";

const Messages: FC = () => {
  const userId = getLocalStorage("user_id");
  const { client } = useClientContext();
  const { currentRoomId, currentRoom } = useSelector(selectCurrentRoomState);
  const { messages } = useSelector(selectMessageState);
  const dispatch = useDispatch();
  const messagesColumnRef = useRef<HTMLDivElement | null>(null);
  const { typingUsers } = useTypingIndicatorContext();

  useEffect(() => {
    if (!currentRoom) return;
    function filterMessages(messages: MatrixEvent[]) {
      return messages.filter(
        (message) =>
          message.getType() === "m.room.message" ||
          message.getType() === "m.call.hangup"
      );
    }
    const getRoomMessages = async () => {
      const scrollBack = await client.scrollback(currentRoom);
      const timeLine = scrollBack
        ?.getLiveTimeline()
        .getEvents() as MatrixEvent[];
      const messages = filterMessages(timeLine);
      dispatch(setMessages(messages));
    };
    getRoomMessages();
  }, [client, currentRoomId, currentRoom, dispatch]);

  useEffect(() => {
    const handleRoomEvent = (event: MatrixEvent, room: Room | undefined) => {
      if (
        room?.roomId === currentRoomId &&
        (event.getType() === "m.room.message" ||
          event.getType() === "m.call.hangup")
      ) {
        dispatch(addMessage(event));
      }
    };

    client.on(RoomEvent.Timeline, handleRoomEvent);

    return () => {
      client.off(RoomEvent.Timeline, handleRoomEvent);
    };
  }, [client, currentRoomId, dispatch]);

  useEffect(() => {
    const options = {
      root: messagesColumnRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const dataIndex = entry.target.getAttribute("id");

          const lastEvent = messages.find(
            (message: any) => message.event.event_id === dataIndex
          );
          const lastEventId = lastEvent?.event.event_id;
          if (!lastEventId || !lastEvent) return;
          const sendReceipt = async () => {
            try {
              await client.sendReceipt(lastEvent, ReceiptType.Read);
              await client.setRoomReadMarkers(currentRoomId, lastEventId);
            } catch (err) {
              console.log("Error sending receipt", err);
            }
          };
          sendReceipt();
        }
      });
    }, options);

    const lastEventId = currentRoom
      ?.getAccountData("m.fully_read")
      ?.getContent()?.event_id;
    const isNewEvent = messages.findIndex(
      (message: any) => message.event.event_id === lastEventId
    );

    const messagesNew =
      isNewEvent !== -1 ? messages.slice(isNewEvent + 1) : null;
    if (!messagesNew) return;
    messagesNew.forEach((message: any) => {
      const messageElement = document.getElementById(
        `${message.event.event_id}`
      );
      const dataIndex = message.getId();

      if (dataIndex && messageElement) {
        observer.observe(messageElement);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [messages, currentRoom, userId, client, currentRoomId]);

  const filterMessages = (messages: MatrixEvent[]) => {
    return messages.filter((message) => !message.getRelation());
  };

  return (
    <div
      className="messages-chat-container"
      id="messages-container"
      ref={messagesColumnRef}
    >
      {filterMessages(messages).map((message: MatrixEvent) => {
        const { sender, event_id } = message.event;
        const isOwnMessage = sender === userId;

        return (
          <div
            key={event_id}
            id={event_id}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <Message message={message} />
          </div>
        );
      })}
      <TypingIndicator typingUsers={typingUsers} />
    </div>
  );
};

export default Messages;
