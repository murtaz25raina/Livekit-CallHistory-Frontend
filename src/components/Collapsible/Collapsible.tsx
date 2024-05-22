import { FC, ReactNode, useState } from "react";
import {
  Add16Filled,
  ChevronDown16Filled,
  ChevronRight16Filled,
  MoreHorizontal16Filled,
} from "@fluentui/react-icons";
import "./Collapsible.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/app/store";
import { setIsCreateRoomModelOpen } from "../../redux/stores/createRoomModal/createRoomModalSlice";

interface CollapsibleProps {
  title: string;
  children: ReactNode;
}

const Collapsible: FC<CollapsibleProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const handleCreateRoomClick = () => {
    dispatch(setIsCreateRoomModelOpen(true));
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setShowMore(true);
  };

  const handleMouseLeave = () => {
    setShowMore(false);
  };

  const icon = isOpen ? <ChevronDown16Filled /> : <ChevronRight16Filled />;
  return (
    <div className="collapsible">
      <div
        className="collapsible-header"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="collapsible-header-wrapper w-full"
          onClick={handleToggle}
        >
          <span className="collapsible-icon">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="collapsible-options-wrapper">
          {showMore && (
            <div className="relative">
              <button>
                <span className="collapsible-option-icon">
                  <MoreHorizontal16Filled />
                </span>
              </button>
            </div>
          )}
          <button onClick={handleCreateRoomClick}>
            <span className="collapsible-option-icon">
              <Add16Filled />
            </span>
          </button>
        </div>
      </div>
      {isOpen && <div className="collapsible-content">{children}</div>}
    </div>
  );
};

export default Collapsible;
