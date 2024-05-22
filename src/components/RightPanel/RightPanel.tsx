import { FC } from "react";
import useMobile from "../../hooks/useMobile";
import { Outlet, useParams } from "react-router-dom";
import "./RightPanel.css";

const RightPanel: FC = () => {
  const { isMobile } = useMobile();
  const { id } = useParams();
  const translateClass = isMobile && id ? "translate-x-0" : "translate-x-full";

  return (
    <main className={`right-panel ${translateClass}`}>
      {id === undefined && !isMobile ? (
        <div className="right-panel-centered-content">
          <h1 className="right-panel-info-box">Please Select a Room</h1>
        </div>
      ) : (
        <Outlet />
      )}
    </main>
  );
};

export default RightPanel;
