import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import { useClientContext } from "../../providers/ClientProvider";
import { getLocalStorage } from "../../helpers/localStorage";
import Separator from "../Separator/Separator";
import {
  Chat24Filled,
  Chat24Regular,
  SignOut24Filled,
  SignOut24Regular,
  Call24Regular,
  Call24Filled 
} from "@fluentui/react-icons";
import TabList from "../TabList/TabList";
import "./Sidebar.css";

const Sidebar: FC = () => {
  const { client } = useClientContext();
  const userName = client.getUserIdLocalpart() || "";
  const userId = getLocalStorage("user_id") || "";
  const avatarUrl = client.getUser(userId)?.avatarUrl || "";
  const tabs = [
    {
      regularIcon: <Chat24Regular />,
      filledIcon: <Chat24Filled />,
      title: "Chat",
      navigate: "/chat",
    },
    {
      regularIcon: <SignOut24Regular />,
      filledIcon: <SignOut24Filled />,
      title: "Logout",
      navigate: "/login",
    },
    {
      regularIcon: <Call24Regular />,
      filledIcon: <Call24Filled />,
      title: "History",
      navigate: "/call-history",
    },
  ];
  return (
    <div className="sidebar-container">
      <Avatar
        name={userName}
        image={{
          src: avatarUrl,
        }}
      />
      <Separator />
      <TabList tabs={tabs} orientation="vertical" />
    </div>
  );
};

export default Sidebar;
