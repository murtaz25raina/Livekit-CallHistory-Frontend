import React, { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useModel } from "providers/useModalProvider";
import ModalSidebar from "./ModalSidebar";
import ModalContainer from "./ModalContainer";
import { selectCurrentRoomState } from "redux/stores/currentRoom/currentRoomSlice";
import { useSelector } from "react-redux";
import { useClientContext } from "providers/ClientProvider";

const RoomSettingModel = () => {
  const [whoIsClicked, setWhoIsClicked] = useState("General");
  const { client } = useClientContext();
  const { setRoomSettingModalIsOpen } = useModel();
  const { currentRoomId } = useSelector(selectCurrentRoomState);
  const getCurrentRoom = client?.getRoom(currentRoomId);

  useEffect(() => {
    console.log("settings called");
  });

  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full flex justify-center items-center bg-gray-950/30"
    >
      <div className="relative w-full max-w-3xl max-h-full">
        <div className="relative bg-white rounded-lg shadow-[0px_0px_13px_9px_#00000024] p-5">
          {/* Header */}
          <div className="w-full flex justify-between items-center border-b">
            <h1 className="font-[PublicSans] text-xl font-medium">
              Room Settings - #{getCurrentRoom?.normalizedName}
            </h1>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
              onClick={() => setRoomSettingModalIsOpen(false)}
            >
              <MdOutlineCancel className="h-5 w-5" />
            </button>
          </div>
          {/* Body */}
          <div className="flex my-4 gap-x-5 w-full">
            {/* Sidebar */}
            <ModalSidebar
              whoIsClicked={whoIsClicked}
              setWhoIsClicked={setWhoIsClicked}
            />
            <div className="w-full">
              <ModalContainer whoIsClicked={whoIsClicked} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSettingModel;
