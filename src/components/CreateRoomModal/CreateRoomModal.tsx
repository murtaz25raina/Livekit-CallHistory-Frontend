import { FC, ChangeEvent, useState } from "react";
import { MdOutlineCancel, MdRemoveCircleOutline } from "react-icons/md";
import useCreateRoom from "../../hooks/useCreateRoom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/app/store";
import {
  setIsCreateRoomModelOpen,
  setRoomName,
} from "../../redux/stores/createRoomModal/createRoomModalSlice";
import "./CreateRoomModal.css";
import { RiCloseCircleLine } from "react-icons/ri";

const CreateRoomModal: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { createRoom, roomName } = useCreateRoom();
  const [participants, setParticipants] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handlePartcipant = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleAddParticipants = () => {
    setParticipants([...participants, inputValue]);
    setInputValue("");
  };

  const closeModal = () => {
    dispatch(setIsCreateRoomModelOpen(false));
  };

  const handleCreateRoom = () => {
    createRoom(roomName, participants);
    closeModal();
  };

  const handleRoomNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setRoomName(e.target.value));
  };

  const handleDeleteParticipant = (i: number) => {
    let newList = participants.filter((p, index) => index !== i);
    setParticipants(newList);
  };

  return (
    <div className="create-room-modal-container">
      <div className="create-room-modal-content">
        <div className="create-room-modal-header">
          <h3 className="create-room-modal-title">Create a New Room</h3>
          <button
            type="button"
            className="create-room-modal-close-btn"
            data-modal-hide="default-modal"
            onClick={closeModal}
          >
            <MdOutlineCancel className="create-room-modal-cancel-icon" />
          </button>
        </div>

        <div className="create-room-modal-body">
          <input
            type="text"
            placeholder="Enter Your Room Name"
            className="py-2 indent-3 border outline-none border-[#ddd] focus:border-indigo-400 w-full rounded font-[PublicSans]"
            value={roomName}
            onChange={handleRoomNameChange}
          />
          <input
            type="text"
            placeholder="Enter Participants"
            className="py-2 indent-3 border outline-none border-[#ddd] focus:border-indigo-400 w-full rounded font-[PublicSans]"
            value={inputValue}
            onChange={handlePartcipant}
          />
          <button
            data-modal-hide="default-modal"
            type="button"
            className="text-white bg-[#7269ef] transition-all duration-200 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={() => {
              handleAddParticipants();
            }}
          >
            Add Participant
          </button>
          <ul>
            {participants.map((value: any, index: number) => (
              <li key={index} className="mt-2">
                <div className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 inline-block">
                  <div className="flex text-center">
                    <RiCloseCircleLine
                      className="text-red-600 mr-[2px] mt-[12px] text-sm"
                      onClick={() => handleDeleteParticipant(index)}
                    />
                    <span className="p-2">{value}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="create-room-modal-footer">
          <button
            type="button"
            className="create-room-modal-button-primary"
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
          <button
            type="button"
            className="create-room-modal-button-secondary"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;
