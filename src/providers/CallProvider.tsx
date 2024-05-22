import React, {
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useClientContext } from "providers/ClientProvider";
import { getLocalTime } from "../helpers/messageTime";
import {
  CallEvent,
  EventType,
  MatrixCall,
  MatrixEvent,
  RoomMember,
} from "matrix-js-sdk";
import { CallEventHandlerEvent } from "matrix-js-sdk/lib/webrtc/callEventHandler";
import { CallErrorCode, CallState } from "matrix-js-sdk/lib/webrtc/call";
import * as sdk from "matrix-js-sdk";
import useSound from "use-sound";
import audioRinging from "../assets/media/ring.mp3";
import audioRingBack from "../assets/media/ringback.mp3";
import { selectCurrentRoomState } from "redux/stores/currentRoom/currentRoomSlice";
import { useSelector } from "react-redux";

interface IUsertyping {
  roomId: string | number;
  userId?: string | number;
  name?: string;
}

export enum AudioID {
  Ring = "ringAudio",
  Ringback = "ringbackAudio",
  CallEnd = "callendAudio",
  Busy = "busyAudio",
}

interface ClientContextType {
  currentRoom: string;
  setCurrentRoom: any;
  incomingCall: boolean;
  call: MatrixCall | null;
  setCall: React.Dispatch<SetStateAction<MatrixCall | null>>;
  reject: () => void;
  answer: () => void;
  hangup: () => void;
  mute: () => void;
  screenShare: () => void;
  InviteHangUp: () => void;
  isCallAttend: boolean;
  callState: string | null;
  isMicrophoneMuted: boolean;
  callType: string;
  setCallType: React.Dispatch<SetStateAction<string>>;
  disableCamera: () => void;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<SetStateAction<boolean>>;
  isCameraDisable: boolean;
}

// localVideoRef: HTMLVideoElement | null;
//   remoteVideoRef: HTMLVideoElement | null;

// callType: string;
// setCallType: React.Dispatch<SetStateAction<string>>;

const MatrixSyncContext = createContext<ClientContextType | null>(null);

export const MatrixSyncProvider = ({ children }: { children: ReactNode }) => {
  const { currentRoomId } = useSelector(selectCurrentRoomState);
  const [currentRoom, setCurrentRoom] = useState(currentRoomId);
  const [incomingCall, setIncomingCall] = useState<boolean>(false);
  const [call, setCall] = useState<MatrixCall | null>(null);
  const [isCallAttend, setIsCallAttend] = useState(false);
  const [callState, setCallState] = useState<string | null>(null);
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isCameraDisable, setIsCameraDisable] = useState<boolean>(false);
  const { client } = useClientContext();

  const [playRinging, playRingAction] = useSound(audioRinging, {
    loop: true,
    forceSoundEnabled: true,
    soundEnabled: true,
  });

  const [playRing, playRingBackAction] = useSound(audioRingBack, {
    loop: true,
    forceSoundEnabled: true,
    soundEnabled: true,
  });

  const [callType, setCallType] = useState<string>("");
  // const localVideoRef = useRef<HTMLVideoElement>(null);
  // const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    client?.on(CallEventHandlerEvent.Incoming, (call: MatrixCall) => {
      // console.log("Incoming  callState", callState);
      console.log("Incoming calltype", call?.type);

      call?.type && setCallType(call?.type);
      setCall(call);
      // Display the incoming call and store it in state
      setIncomingCall(true);
      setIsCallAttend(false);

      // Set up listeners for call hangup and errors
      call.on(CallEvent.Hangup, (event: any) => {
        setIncomingCall(false); // Clear the incoming call state
      });

      call.on(CallEvent.Error, (err: any) => {
        console.log("err", err);

        setIncomingCall(false); // Clear the incoming call state
        setIsCallAttend(false);
        setCallState(null);
        setIsMicrophoneMuted(false);
        setIsCameraDisable(false);
        playRingAction.stop();
        playRingBackAction.stop();
      });
    });
  }, [client, currentRoom]);

  useEffect(() => {
    client?.on(CallEvent.State, (state: CallState) => {
      call?.type && setCallType(call?.type);
      console.log("OutGoing  state", state);

      // call && setCallType(call?.type);
      if (state === CallState.InviteSent) {
        playRing();
        setCallState(state);
        // videoStream();
      }
      if (state === CallState.Ended) {
        setIncomingCall(false);
        setCallState(null);
        playRingAction.stop();
        playRingBackAction.stop();
      }

      if (state === CallState.Ringing) {
        playRinging();
        setCallState(state);
      }
      if (state === CallState.Connected) {
        setCallState(state);
        playRingAction.stop();
        playRingBackAction.stop();
        audioStream();
        videoStream();
      }
    });
  }, [call, client]);

  // callType

  const audioStream = async () => {
    // const audioElement: any = new Audio();
    // audioElement.srcObject = call?.remoteUsermediaStream;
    // audioElement.play();
    const audioElement: HTMLAudioElement = new Audio();
    if (audioElement && call?.remoteUsermediaStream) {
      audioElement.srcObject = await call?.remoteUsermediaStream;
      audioElement.play();
    }
  };

  const videoStream = async () => {
    const localVideo = document.getElementById(
      "localVideo"
    ) as HTMLVideoElement | null;
    const remoteVideo = document.getElementById(
      "remoteVideo"
    ) as HTMLVideoElement | null;

    if (localVideo && call?.localUsermediaStream) {
      localVideo.srcObject = await call?.localUsermediaStream;
      localVideo.play();
    }
    if (remoteVideo && call?.remoteUsermediaStream) {
      remoteVideo.srcObject = await call?.remoteUsermediaStream;
      remoteVideo.play();
    }
  };

  //working
  const reject = () => {
    console.log("~~~~~ Reject called ~~~~");
    call?.reject();
  };

  const InviteHangUp = () => {
    console.log("~~~~~ InviteHangUp called ~~~~");
    call?.hangup(CallErrorCode.UserHangup, true);
  };

  const hangup = () => {
    console.log("~~~~~ Hangup called ~~~~");
    call?.hangup(CallErrorCode.UserHangup, true);
  };

  const answer = async () => {
    call?.answer();
  };

  //working
  const mute = () => {
    console.log("Mute function called");
    call?.setMicrophoneMuted(!call?.isMicrophoneMuted());
    setIsMicrophoneMuted(!call?.isMicrophoneMuted());
  };

  const disableCamera = () => {
    console.log("disableCamera function called");
    call?.setLocalVideoMuted(!call?.isLocalVideoMuted());
    setIsCameraDisable(!call?.isLocalVideoMuted());
  };

  const onHold = () => {
    call?.setRemoteOnHold(!call.isRemoteOnHold);
  };

  const screenShare = () => {
    call?.setScreensharingEnabled(true);
  };

  return (
    <MatrixSyncContext.Provider
      value={{
        currentRoom,
        setCurrentRoom,
        incomingCall,
        answer,
        reject,
        hangup,
        call,
        isCallAttend,
        callState,
        mute,
        isMicrophoneMuted,
        setCall,
        screenShare,
        InviteHangUp,
        callType,
        setCallType,
        disableCamera,
        modalOpen,
        setModalOpen,
        isCameraDisable,
      }}
    >
      {children}
    </MatrixSyncContext.Provider>
  );
};

export function useMatrixSync() {
  const context = useContext(MatrixSyncContext);
  if (!context) {
    throw new Error("useMatrixClient must be used within");
  }
  return context;
}

// callType,
// setCallType,
// localVideoRef,
// remoteVideoRef,
