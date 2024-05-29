import { FC, useCallback, useEffect, useState } from "react";
import "./Actions.css";
import {
  Call24Filled,
  Info24Filled,
  Video24Filled,
} from "@fluentui/react-icons";
import { MdOutlineCancel } from "react-icons/md";
import { RoomMember } from "matrix-js-sdk";
import { selectCurrentRoomState } from "redux/stores/currentRoom/currentRoomSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useClientContext } from "providers/ClientProvider";
import { useMatrixSync } from "providers/CallProvider";
import { MediaType } from "../../../../helpers/constant";
import { AppDispatch } from "redux/app/store";
import {
  setAmICalling,
  setCallDetails,
  setCallType,
  setMembersWhoAreGettingCall,
  // setOnCall
} from "redux/stores/callingDetails/callingDetails";
import { io } from "socket.io-client";
import {
  selectCallHistoryState,
  setCallHistory,
  setCurrentCall,
} from "redux/stores/callHistory/callHistory";
import { getCurrentTimeString } from "helpers/currentTime";
import useRoom from "hooks/useRoom";

const socket = io("http://localhost:3001");

const Actions: FC = () => {
  const { id } = useParams();
  const [viewRoomInfo, setViewRoomInfo] = useState(false);
  const [members, setMembers] = useState<RoomMember[] | undefined>();
  const { currentRoomId } = useSelector(selectCurrentRoomState);
  const { currentRoom, setCall } = useMatrixSync();
  const { client } = useClientContext();
  const userName = client.getUserIdLocalpart() || "";
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { calls } = useSelector(selectCallHistoryState);


  useEffect(() => {
    let room = client?.getRoom(currentRoomId);
    let members = room?.getMembers();
    setMembers(members);
  }, [currentRoomId]);

  const handleRoomName = (name: string) => {
    return name?.replace(/(serverlinuxguidesde)/i, "");
  };

  const makeACallHandler = (call_type: string) => {
    let thisRoom = client?.getRoom(currentRoomId);
    let membersInRoom = thisRoom?.getMembers();
    dispatch(setAmICalling(true));
    dispatch(setCallType(call_type));
    let membersToCall:string[] = [];
    // console.log("ok",members);
    if(membersInRoom){
      membersInRoom.forEach((member) => {
        // console.log(member)
        if(member.name !== userName){
          membersToCall.push(member.name);
        }
      })
    }
    dispatch(setMembersWhoAreGettingCall(membersToCall))
    // dispatch(setOnCall(true));
    const currentTime = getCurrentTimeString();
    let room = client?.getRoom(currentRoomId);
    const rName = room?.getDefaultRoomName(currentRoomId) || ""
    let allCalls = [...calls];
    const callDetail = {
      callId : currentRoomId+currentTime,
      callerName: userName,
      callType: call_type,
      callTime:currentTime,
      callStartTime: "",
    callEndTime: "",
      callStatus: "Didn't respond",
      recieverName: rName,
    }
    allCalls.push(callDetail);
    dispatch(setCurrentCall(callDetail));
    dispatch(setCallHistory(allCalls));
    socket.emit("call", currentRoomId, userName, membersToCall, call_type,callDetail);
  };

  const handleCallButtonClick = useCallback(
    (callType: string) => {
      // setCallType(callType);
      const matrixCall = client?.createCall(currentRoomId);
      if (matrixCall) {
        setCall(matrixCall);
      }
      if (callType === MediaType.AUDIO) {
        // matrixCall?.placeVoiceCall();
        makeACallHandler("audio");
      }
      if (callType === MediaType.VIDEO) {
        // matrixCall?.placeVideoCall();
        makeACallHandler("video");
      }
    },
    [client, currentRoomId, setCall]
  );

  const makeAudioCall = () => {
    handleCallButtonClick(MediaType.AUDIO);
  };

  const makeVideoCall = () => {
    handleCallButtonClick(MediaType.VIDEO);
  };

  const RoomInfo = useCallback(
    ({ members }: { members: RoomMember[] | undefined }) => {
      return (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full flex justify-center items-center bg-gray-950/30"
        >
          <div className="relative w-[425px] max-w-3xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-[0px_0px_13px_9px_#00000024] p-5">
              <div className="w-full flex justify-between items-center border-b">
                <h1 className="font-[PublicSans] text-xl font-medium pb-4">
                  Room Info
                </h1>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white mb-4"
                  data-modal-hide="default-modal"
                  onClick={() => setViewRoomInfo(false)}
                >
                  <MdOutlineCancel className="h-5 w-5" />
                </button>
              </div>
              {/* Body */}
              <div className="my-2 w-full">
                <form className="md:p-1">
                  <div className="grid gap-4 grid-cols-2">
                    {id && (
                      <div className="col-span-2 pb-3">
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Room Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type product name"
                          value={handleRoomName(id).toUpperCase()}
                          readOnly
                        />
                      </div>
                    )}

                    {members && (
                      <div className="col-span-2">
                        <label
                          htmlFor="members"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Room Members
                        </label>
                        <ul>
                          {members?.map((member: any) => (
                            <li key={member.userId} className="my-2">
                              <div className="flex items-center gap-4">
                                <svg
                                  className="absolute w-6 h-6 text-blue-400 "
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                                <div className="font-medium dark:text-white ms-10">
                                  <div className=" mt-2">
                                    {member.name.toUpperCase()}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    },
    []
  );

  return (
    <div>
      <div className="chat-room-action-icons-container">
        <span className="chat-room-action-icon-container">
          <Call24Filled
            className="chat-room-action-icon"
            onClick={() => {
              makeAudioCall();
            }}
          />
        </span>
        <span className="chat-room-action-icon-container">
          <Video24Filled
            className="chat-room-action-icon"
            onClick={() => {
              makeVideoCall();
            }}
          />
        </span>
        <span className="chat-room-action-icon-container">
          <Info24Filled
            className="chat-room-action-icon"
            onClick={() => setViewRoomInfo(true)}
          />
        </span>
      </div>
      {viewRoomInfo && <RoomInfo members={members} />}
    </div>
  );
};

export default Actions;
