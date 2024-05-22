import { FC } from "react";
import { GrAttachment } from "react-icons/gr";
import "./AttachmentButton.css";

const AttachmentButton: FC = () => {
  return (
    <div className="chat-attachment-button" title="Attach File">
      <GrAttachment />
    </div>
  );
};

export default AttachmentButton;
