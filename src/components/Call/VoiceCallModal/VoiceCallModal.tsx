import { AiFillAudio } from "react-icons/ai";
import {
  FaCompress,
  FaExpandArrowsAlt,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { IoShare } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { HiPhoneMissedCall } from "react-icons/hi";
import { useEffect, useState } from "react";
import { IoMdCall } from "react-icons/io";
import { CallState } from "matrix-js-sdk/lib/webrtc/call";
import { IoMdMicOff } from "react-icons/io";
import { CALL_STATE } from "../../../helpers/constant";
import { useMatrixSync } from "providers/CallProvider";
import RoomProfile from "components/RoomProfile/roomProfile";

const VoiceCallModal = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const {
    answer,
    reject,
    hangup,
    mute,
    callState,
    call,
    isMicrophoneMuted,
    InviteHangUp,
    callType,
    disableCamera,
    isCameraDisable,
  } = useMatrixSync();

  const goFullScreen = () => {
    let modalScreenElement = document.getElementById("modalScreen");
    modalScreenElement?.requestFullscreen();
    setIsFullScreen(!isFullScreen);
  };

  const exitFullScreen = () => {
    document.exitFullscreen();
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    console.log("voice modal rendered", callState);
  }, [callState]);

  return (
    <>
      <div className="absolute z-10 flex items-center justify-center w-full h-full bg-slate-800/30">
        <div
          id="modalScreen"
          className="flex flex-col items-center justify-center w-full max-w-2xl px-1 py-8 m-4 rounded-md shadow-2xl bg-slate-950 gap-y-10"
        >
          {/* Go & Exit the full screen */}
          <h1 className="text-lg text-yellow-600">{callType}</h1>
          <div
            className={`w-full flex justify-end px-4 ${
              isFullScreen && "absolute top-10 right-10"
            }`}
          >
            {isFullScreen ? (
              <FaCompress
                className="w-5 h-5 text-white cursor-pointer"
                onClick={() => {
                  exitFullScreen();
                }}
              />
            ) : (
              <FaExpandArrowsAlt
                className="w-5 h-5 text-white cursor-pointer"
                onClick={() => {
                  goFullScreen();
                }}
              />
            )}
          </div>

          {/* Profile */}
          <RoomProfile roomId={call?.roomId} className="w-24 h-24" />

          {callType === "voice" ? (
            <>
              {callState === CallState.InviteSent && (
                <>
                  <h1 className="text-lg text-green-600">
                    {CALL_STATE[callState]}
                  </h1>
                  <div className="flex gap-x-4">
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full cursor-pointer"
                      onClick={() => {
                        InviteHangUp();
                      }}
                    >
                      <HiPhoneMissedCall className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </>
              )}
              {callState === CallState.Ringing && (
                <>
                  <h1 className="text-lg text-green-600">
                    {CALL_STATE[callState]}
                  </h1>

                  <div className="flex gap-x-4">
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full cursor-pointer"
                      onClick={() => {
                        answer();
                      }}
                    >
                      <IoMdCall className="w-6 h-6 text-gray-700" />
                    </div>
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full cursor-pointer"
                      onClick={() => {
                        reject();
                      }}
                    >
                      <HiPhoneMissedCall className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </>
              )}
              {callState === CallState.Connected && (
                <>
                  <h1 className="text-lg text-green-600">
                    {CALL_STATE[callState]}
                  </h1>
                  <div className="flex gap-x-4">
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-white rounded-full cursor-pointer"
                      onClick={() => {
                        mute();
                      }}
                    >
                      {isMicrophoneMuted ? (
                        <IoMdMicOff className="w-6 h-6 text-gray-700" />
                      ) : (
                        <AiFillAudio className="w-6 h-6 text-gray-700" />
                      )}
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full cursor-pointer">
                      <IoShare className="w-6 h-6 text-gray-700" />
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full cursor-pointer">
                      <IoIosMore className="w-6 h-6 text-gray-700" />
                    </div>
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full cursor-pointer"
                      onClick={() => {
                        hangup();
                      }}
                    >
                      <HiPhoneMissedCall className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {callState === CallState.InviteSent && (
                <>
                  <h1 className="text-lg text-green-600">
                    {CALL_STATE[callState]}
                  </h1>
                  <div className="flex gap-x-4">
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full cursor-pointer"
                      onClick={() => {
                        InviteHangUp();
                      }}
                    >
                      <HiPhoneMissedCall className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </>
              )}

              {callState === CallState.Ringing && (
                <>
                  <h1 className="text-lg text-green-600">
                    {CALL_STATE[callState]}
                  </h1>
                  <div className="flex gap-x-4">
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full cursor-pointer"
                      onClick={() => {
                        answer();
                      }}
                    >
                      <FaVideo className="w-6 h-6 text-gray-700" />
                    </div>
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full cursor-pointer"
                      onClick={() => {
                        reject();
                      }}
                    >
                      <HiPhoneMissedCall className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </>
              )}

              {callState === CallState.Connected && (
                <>
                  <h1 className="text-lg text-green-600">
                    {CALL_STATE[callState]}
                  </h1>
                  <div className="flex gap-x-4">
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-white rounded-full cursor-pointer"
                      onClick={() => {
                        mute();
                      }}
                    >
                      {isMicrophoneMuted ? (
                        <IoMdMicOff className="w-6 h-6 text-gray-700" />
                      ) : (
                        <AiFillAudio className="w-6 h-6 text-gray-700" />
                      )}
                    </div>
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-white rounded-full cursor-pointer"
                      onClick={() => {
                        disableCamera();
                      }}
                    >
                      {isCameraDisable ? (
                        <FaVideoSlash className="w-6 h-6 text-gray-700" />
                      ) : (
                        <FaVideo className="w-6 h-6 text-gray-700" />
                      )}
                    </div>
                    <div
                      className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full cursor-pointer"
                      onClick={() => {
                        hangup();
                      }}
                    >
                      <HiPhoneMissedCall className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </>
              )}
              <div
                className={`w-full flex justify-between ${
                  callState === CallState.Connected ? "block" : "hidden"
                }`}
              >
                <div className="border-2 border-green-500">
                  <video className="w-52" id="localVideo"></video>
                </div>
                <div className="border-2 border-blue-500">
                  <video className="w-52" id="remoteVideo"></video>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VoiceCallModal;
