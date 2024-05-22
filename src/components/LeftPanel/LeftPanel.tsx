import { FC } from "react";
import Collapsible from "../Collapsible/Collapsible";
import RoomList from "../RoomList/RoomList";
import "./LeftPanel.css";

const LeftPanel: FC = () => {
  return (
    <div className="left-panel-container">
      <div className="collapsible-panel-container">
        <Collapsible title="Rooms">
          <RoomList />
        </Collapsible>
      </div>
    </div>
  );
};

export default LeftPanel;
