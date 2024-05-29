import { FC, useEffect, useRef, useState } from "react";
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
import { toast } from "react-toastify";

const Messages: FC = () => {
  const userId = getLocalStorage("user_id");
  const { client } = useClientContext();
  const { currentRoomId, currentRoom } = useSelector(selectCurrentRoomState);
  const { messages } = useSelector(selectMessageState);
  const dispatch = useDispatch();
  const messagesColumnRef = useRef<HTMLDivElement | null>(null);
  const { typingUsers } = useTypingIndicatorContext();

  const [visibleMessages, setVisibleMessages] = useState<MatrixEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const increment = 8;

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
      setVisibleMessages([])
      console.log("currentRoom",currentRoom);
      const scrollBack = await client.scrollback(currentRoom);
      const timeLine = scrollBack
        ?.getLiveTimeline()
        .getEvents() as MatrixEvent[];
        // console.log(timeLine)
      const messages = filterMessages(timeLine);
      //////
      if (messages.length > 0) {
        const initialMessages = messages.slice(-increment);
        console.log("Initial visible messages:", initialMessages);
        setVisibleMessages(initialMessages);
        if (initialMessages.length < messages.length) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      }
      //////
      dispatch(setMessages(messages));
    };
    getRoomMessages();
  }, [client, currentRoomId, currentRoom]);

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


  const loadMoreMessages = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const id = toast.loading("Loading...", {
      position: "top-center",
      hideProgressBar: true,
      closeOnClick: false,
      draggable: false,
    });

    setTimeout(() => {
      const currentLength = visibleMessages.length;
      const totalLength = messages.length;

      const newStartIndex = Math.max(totalLength - currentLength - increment, 0);
      const newMessages = messages.slice(newStartIndex, totalLength - currentLength);

      setVisibleMessages((prevMessages) => [...newMessages, ...prevMessages]);

      if (newStartIndex === 0) {
        setHasMore(false);
      }

      toast.update(id, {
        render: "Load complete!",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });

      setLoading(false);
    }, 1500);
  };

  const handleScroll = () => {
    if(messagesColumnRef.current){
    const sTop = messagesColumnRef.current?.scrollTop;
    const cHeight = messagesColumnRef.current?.clientHeight;
    const currentPosition = Math.abs(sTop);
    const height = Math.abs(cHeight);
    const scrollPosition = Math.round(currentPosition + height);
    // console.log(scrollPosition,"and",messagesColumnRef.current?.scrollHeight)
    if (
      messagesColumnRef.current?.scrollHeight === scrollPosition &&
      hasMore &&
      !loading
    ) {
      // console.log("Loading more messages on scroll");
      loadMoreMessages();
    }
  }
  };

  useEffect(() => {
    const chatContainer = messagesColumnRef.current;
    chatContainer?.addEventListener("scroll", handleScroll);
    return () => {
      chatContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loading, visibleMessages]); // Ensure visibleMessages is included here


  const filterMessages = (messages: MatrixEvent[]) => {
    return messages.filter((message) => !message.getRelation()).reverse();
  };
  // console.log("filtered",filterMessages(messages));
  
  return (
    <div
      className="messages-chat-container"
      id="messages-container"
      ref={messagesColumnRef}
      style={{ display: "flex", flexDirection: "column-reverse", height: "100%", overflowY: "auto" }}
    
    >
      {filterMessages(visibleMessages).map((message: MatrixEvent) => {
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





















// import { FC, useEffect, useRef } from "react";
// import { getLocalStorage } from "../../../helpers/localStorage";
// import { MatrixEvent, ReceiptType, Room, RoomEvent } from "matrix-js-sdk";
// import Message from "../Message/Message";
// import { useClientContext } from "../../../providers/ClientProvider";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addMessage,
//   selectMessageState,
//   setMessages,
// } from "../../../redux/stores/message/messageSlice";
// import { selectCurrentRoomState } from "../../../redux/stores/currentRoom/currentRoomSlice";
// import "./Messages.css";
// import TypingIndicator from "../../TypingIndicator/TypingIndicator";
// import { useTypingIndicatorContext } from "../../../providers/TypingIndicatorProvider";

// const Messages: FC = () => {
//   const userId = getLocalStorage("user_id");
//   const { client } = useClientContext();
//   const { currentRoomId, currentRoom } = useSelector(selectCurrentRoomState);
//   const { messages } = useSelector(selectMessageState);
//   const dispatch = useDispatch();
//   const messagesColumnRef = useRef<HTMLDivElement | null>(null);
//   const { typingUsers } = useTypingIndicatorContext();

//   useEffect(() => {
//     if (!currentRoom) return;
//     function filterMessages(messages: MatrixEvent[]) {
//       return messages.filter(
//         (message) =>
//           message.getType() === "m.room.message" ||
//           message.getType() === "m.call.hangup"
//       );
//     }
//     const getRoomMessages = async () => {
//       const scrollBack = await client.scrollback(currentRoom);
//       const timeLine = scrollBack
//         ?.getLiveTimeline()
//         .getEvents() as MatrixEvent[];
//       const messages = filterMessages(timeLine);
//       dispatch(setMessages(messages));
//     };
//     getRoomMessages();
//   }, [client, currentRoomId, currentRoom, dispatch]);

//   useEffect(() => {
//     const handleRoomEvent = (event: MatrixEvent, room: Room | undefined) => {
//       if (
//         room?.roomId === currentRoomId &&
//         (event.getType() === "m.room.message" ||
//           event.getType() === "m.call.hangup")
//       ) {
//         dispatch(addMessage(event));
//       }
//     };

//     client.on(RoomEvent.Timeline, handleRoomEvent);

//     return () => {
//       client.off(RoomEvent.Timeline, handleRoomEvent);
//     };
//   }, [client, currentRoomId, dispatch]);

//   useEffect(() => {
//     const options = {
//       root: messagesColumnRef.current,
//       rootMargin: "0px",
//       threshold: 0.5,
//     };

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           const dataIndex = entry.target.getAttribute("id");

//           const lastEvent = messages.find(
//             (message: any) => message.event.event_id === dataIndex
//           );
//           const lastEventId = lastEvent?.event.event_id;
//           if (!lastEventId || !lastEvent) return;
//           const sendReceipt = async () => {
//             try {
//               await client.sendReceipt(lastEvent, ReceiptType.Read);
//               await client.setRoomReadMarkers(currentRoomId, lastEventId);
//             } catch (err) {
//               console.log("Error sending receipt", err);
//             }
//           };
//           sendReceipt();
//         }
//       });
//     }, options);

//     const lastEventId = currentRoom
//       ?.getAccountData("m.fully_read")
//       ?.getContent()?.event_id;
//     const isNewEvent = messages.findIndex(
//       (message: any) => message.event.event_id === lastEventId
//     );

//     const messagesNew =
//       isNewEvent !== -1 ? messages.slice(isNewEvent + 1) : null;
//     if (!messagesNew) return;
//     messagesNew.forEach((message: any) => {
//       const messageElement = document.getElementById(
//         `${message.event.event_id}`
//       );
//       const dataIndex = message.getId();

//       if (dataIndex && messageElement) {
//         observer.observe(messageElement);
//       }
//     });

//     return () => {
//       observer.disconnect();
//     };
//   }, [messages, currentRoom, userId, client, currentRoomId]);

//   const filterMessages = (messages: MatrixEvent[]) => {
//     return messages.filter((message) => !message.getRelation());
//   };

//   return (
//     <div
//       className="messages-chat-container"
//       id="messages-container"
//       ref={messagesColumnRef}
//     >
//       {filterMessages(messages).map((message: MatrixEvent) => {
//         const { sender, event_id } = message.event;
//         const isOwnMessage = sender === userId;

//         return (
//           <div
//             key={event_id}
//             id={event_id}
//             className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
//           >
//             <Message message={message} />
//           </div>
//         );
//       })}
//       <TypingIndicator typingUsers={typingUsers} />
//     </div>
//   );
// };

// export default Messages;

