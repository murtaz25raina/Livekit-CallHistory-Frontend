import { FC, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TabList.css";
import { useClientContext } from "providers/ClientProvider";
import { toast } from "react-toastify";

interface Tab {
  regularIcon: ReactNode;
  filledIcon: ReactNode;
  title: string;
  navigate: string;
}

interface TabListProps {
  tabs: Tab[];
  orientation?: "horizontal" | "vertical";
}

const TabList: FC<TabListProps> = ({ tabs, orientation = "horizontal" }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();
  const { client } = useClientContext();
  const handleTabClick = (index: number) => {
    if (index === 1) {
      client
        .logout(true)
        .then(async () => {
          client.stopClient();
          await client.clearStores();
          localStorage.clear();
          window.location.reload();
          toast.success("Logged out successfully");
        })
        .catch((errors) => {
          console.error("Error during logout:", errors.error);
          toast.error("Logout failed");
        });
    } else {
      setActiveTab(index);
      navigate(tabs[index].navigate);
    }
  };
  const tabListOrientation =
    orientation === "vertical" ? "flex-col" : "flex-row";

  return (
    <div>
      <ul className={`tab-container ${tabListOrientation}`}>
        {tabs.map((tab, index) => (
          <li key={index}>
            <button
              onClick={() => handleTabClick(index)}
              className={`tab ${
                activeTab === index ? "tab-active" : "tab-btn"
              }`}
            >
              <span
                className={`tab-icon ${
                  activeTab === index ? "tab-icon-active" : ""
                }`}
              >
                {activeTab === index ? tab.filledIcon : tab.regularIcon}
              </span>
              <span
                className={`tab-title ${
                  activeTab === index ? "font-medium" : "font-normal"
                }`}
              >
                {tab.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabList;
