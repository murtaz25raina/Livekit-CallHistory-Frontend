import {
  createContext,
  useContext,
  FC,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { MatrixEvent, RoomMember, RoomMemberEvent } from "matrix-js-sdk";
import { useClientContext } from "./ClientProvider";
import { selectCurrentRoomState } from "../redux/stores/currentRoom/currentRoomSlice";
import { useSelector } from "react-redux";

interface TypingIndicatorContextProps {
  typingUsers: string[];
}

interface ChildrenProp {
  children: ReactNode;
}

const TypingIndicatorContext = createContext<
  TypingIndicatorContextProps | undefined
>(undefined);

const TypingIndicatorProvider: FC<ChildrenProp> = ({ children }) => {
  const { client } = useClientContext();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { currentRoom } = useSelector(selectCurrentRoomState);
  useEffect(() => {
    if (!client) return;

    const handleRoomMember = (event: MatrixEvent, member: RoomMember) => {
      if (member.typing) {
        setTypingUsers(event.getContent().user_ids);
      } else {
        setTypingUsers(event.getContent().user_ids);
      }
    };
    client?.on(RoomMemberEvent.Typing, handleRoomMember);

    return () => {
      client.off(RoomMemberEvent.Typing, handleRoomMember);
    };
  }, [currentRoom, client, typingUsers]);

  return (
    <TypingIndicatorContext.Provider value={{ typingUsers }}>
      {children}
    </TypingIndicatorContext.Provider>
  );
};

const useTypingIndicatorContext = (): TypingIndicatorContextProps => {
  const context = useContext(TypingIndicatorContext);
  if (!context) {
    throw new Error(
      "useTypingIndicatorContext must be used within a TypingIndicatorProvider"
    );
  }
  return context;
};

export { TypingIndicatorProvider, useTypingIndicatorContext };
