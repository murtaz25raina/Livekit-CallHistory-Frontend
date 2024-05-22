import React, { useEffect, useState } from "react";
import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  LayoutContextProvider,
  formatChatMessageLinks,
  useTracks,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  AudioConference,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { FaCompress, FaExpandArrowsAlt } from "react-icons/fa";
import { HiPhoneMissedCall } from "react-icons/hi";
import { IoMdCall } from "react-icons/io";
import { useClientContext } from "../../providers/ClientProvider";
import "./VideoCall.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCallState,
  setAmICalling,
  setCallDetails,
  setIsCalling,
  setRoomName,
  // setOnCall,
  setUserToken,
} from "redux/stores/callingDetails/callingDetails";
import { AppDispatch } from "redux/app/store";
import { io } from "socket.io-client";
import { selectCurrentRoomState } from "redux/stores/currentRoom/currentRoomSlice";
import axios from "axios";

const socket = io("http://localhost:3001");

const serverUrl = "http://127.0.0.1:7880";

const VideoCallModal = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const {
    roomName,
    userToken,
    callType,
    isCalling,
    userWhoIsCalling,
    AmICalling,
    membersWhoAreGettingCall,
    // onCall
  } = useSelector(selectCallState);
  const dispatch = useDispatch<AppDispatch>();
  const { client } = useClientContext();
  const userName = client.getUserIdLocalpart() || "";
  const { currentRoomId } = useSelector(selectCurrentRoomState);

  const videoCallLivekitHandler = async () => {
    try {
      const resp = await fetch(
        `http://localhost:3001/getToken?roomName=${roomName}&participantName=${userName}`
      );
      const token = await resp.text();
      dispatch(setUserToken(token));
      dispatch(setIsCalling(false));
      dispatch(setAmICalling(false));
      dispatch(setRoomName(roomName));
      // dispatch(setOnCall(true))
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const handleAcceptCall = () => {
    videoCallLivekitHandler();
  };

  const handleRejectCall = async () => {
    let thisRoom = client?.getRoom(currentRoomId);
    let membersInRoom = thisRoom?.getMembers();
    // dispatch(setOnCall(false))
    dispatch(
      setCallDetails({
        callType: null,
        userToken: "",
        roomName: "",
        userWhoIsCalling: "",
        membersWhoAreGettingCall: [],
        isCalling: null,
        AmICalling: false,
      })
    );
    socket.emit(
      "rejectCall",
      userName,
      userWhoIsCalling,
      roomName,
      membersInRoom
    );
  };

  const handleCancelCall = () => {
    let thisRoom = client?.getRoom(currentRoomId);
    let membersInRoom = thisRoom?.getMembers();
    dispatch(setIsCalling(null));
    dispatch(setAmICalling(false));
    // dispatch(setOnCall(false))
    socket.emit("cancelCall", userName, membersInRoom, roomName);
  };

  const onUserJoinedCall = () => {
    socket.emit("acceptCall", userName, userWhoIsCalling, roomName, callType);
    dispatch(setAmICalling(false));
    // dispatch(setOnCall(true))
  };

  const onUserLeftCall = async () => {
    // dispatch(setUserToken(""));
    // dispatch(setIsCalling(null));
    // dispatch(setOnCall(false))

    try {
      const response = await axios.get(
        "http://localhost:3001/getParticipants",
        {
          params: {
            roomName: roomName,
          },
        }
      );
      const res = response.data.data;
      if (res && res.length === 0) {

        // console.log("booom",res)
        let thisRoom = client?.getRoom(currentRoomId);
        let membersInRoom = thisRoom?.getMembers();
        socket.emit("cancelCall", userName, membersInRoom, roomName);
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
    // console.log("room",roomName)
    dispatch(
      setCallDetails({
        callType: null,
        userToken: "",
        roomName: "",
        userWhoIsCalling: "",
        membersWhoAreGettingCall: [],
        isCalling: null,
        AmICalling: false,
      })
    );
  };

  const goFullScreen = () => {
    let modalScreenElement = document.getElementById("modalScreen");
    modalScreenElement?.requestFullscreen();
    setIsFullScreen(true);
  };

  const exitFullScreen = () => {
    document.exitFullscreen();
    setIsFullScreen(false);
  };

  return (
    <div className="absolute z-10 flex items-center justify-center w-full h-full bg-slate-800/30">
      <div
        id="modalScreen"
        className="flex flex-col items-center justify-center w-full max-w-2xl px-1 py-8 m-4 rounded-md shadow-2xl bg-slate-950 gap-y-10"
      >
        <div className="w-full flex justify-end px-4">
          {isFullScreen ? (
            <FaCompress
              className="w-5 h-5 text-white cursor-pointer"
              onClick={exitFullScreen}
            />
          ) : (
            <FaExpandArrowsAlt
              className="w-5 h-5 text-white cursor-pointer"
              onClick={goFullScreen}
            />
          )}
        </div>
        {AmICalling ? (
          <div className="flex flex-col items-center">
            <h1 className="text-lg text-yellow-600">
              {callType?.toUpperCase()} Calling
            </h1>
            <div className="flex gap-x-4">
              {/* <div
          className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full cursor-pointer"
          onClick={handleAcceptCall}
        >
          <IoMdCall className="w-6 h-6 text-gray-700" />
        </div> */}
              <div
                className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full cursor-pointer"
                onClick={handleCancelCall}
              >
                <HiPhoneMissedCall className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ) : !isCalling ? (
          <LayoutContextProvider>
            {callType === "video" && (
              <LiveKitRoom
                video={false}
                audio={false}
                token={userToken}
                serverUrl={serverUrl}
                onDisconnected={() => onUserLeftCall()}
                data-lk-theme="default"
                onConnected={() => onUserJoinedCall()}
              >
                <MyVideoConference />
                <RoomAudioRenderer />
                <ControlBar controls={{chat:false}} />
              </LiveKitRoom>
            )}
            {callType === "audio" && (
              <LiveKitRoom
                video={false}
                audio={false}
                token={userToken}
                serverUrl={serverUrl}
                onDisconnected={() => onUserLeftCall()}
                data-lk-theme="default"
                onConnected={() => onUserJoinedCall()}
              >
                {/* <AudioConference/> */}
                <RoomAudioRenderer />
                <MyAudioConference />
                <ControlBar controls={{camera:false,chat:false}}/>
              </LiveKitRoom>
            )}
          </LayoutContextProvider>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-lg text-yellow-600">
              {callType?.toUpperCase()} Call from {userWhoIsCalling}
            </h1>
            <div className="flex gap-x-4">
              <div
                className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full cursor-pointer"
                onClick={handleAcceptCall}
              >
                <IoMdCall className="w-6 h-6 text-gray-700" />
              </div>
              <div
                className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full cursor-pointer"
                onClick={handleRejectCall}
              >
                <HiPhoneMissedCall className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallModal;

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}



function MyAudioConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Microphone, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}