import { FC } from "react";
import { getLocalStorage } from "../../helpers/localStorage";
import "./TypingIndicator.css";
import { useClientContext } from "providers/ClientProvider";

interface TypingIndicatorProps {
  typingUsers: string[];
}

const TypingIndicator: FC<TypingIndicatorProps> = ({ typingUsers }) => {
  const { client } = useClientContext();
  const getTypingMessage = () => {
    if (!client) return;
    const userId = getLocalStorage("user_id");
    const filterUsers = typingUsers.filter((user) => user !== userId);
    const count = filterUsers.length;
    const userNames = filterUsers.map(
      (user) => client.getUser(user)?.displayName
    ) as string[];

    const users = [...new Set(userNames)];

    if (count === 0) {
      return "";
    }

    if (count === 1) {
      return `${users[0]} is typing...`;
    }

    if (count === 2) {
      return `${users[0]} and ${users[1]} are typing...`;
    }

    const lastUser = users.pop();
    return `${users.join(", ")} and ${lastUser} are typing...`;
  };

  return <span className="typing-indicator-content">{getTypingMessage()}</span>;
};

export default TypingIndicator;
