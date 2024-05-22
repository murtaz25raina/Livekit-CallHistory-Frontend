import { FC } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import RightPanel from "../RightPanel/RightPanel";
import CreateRoomModal from "../CreateRoomModal/CreateRoomModal";
import { useSelector } from "react-redux";
import { selectCreateRoomModalState } from "../../redux/stores/createRoomModal/createRoomModalSlice";
import "./ChatPanel.css";

const ChatPanel: FC = () => {
  const { isCreateRoomModelOpen } = useSelector(selectCreateRoomModalState);
  const renderElement = isCreateRoomModelOpen ? <CreateRoomModal /> : null;
  return (
    <div className="chat-panel">
      <div className="chat-panel-container">
        <div className="chat-left-panel-container">
          <LeftPanel />
        </div>
        <RightPanel />
        {renderElement}
      </div>
    </div>
  );
};

export default ChatPanel;
