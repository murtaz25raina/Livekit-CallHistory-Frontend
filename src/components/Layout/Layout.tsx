import { FC, useEffect } from "react";
import { io } from "socket.io-client";
import { Howl } from "howler";
import Auth from "../Auth/Auth";
import Main from "../Main/Main";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";
import { useClientContext } from "providers/ClientProvider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "redux/app/store";
import {
  selectCallState,
  setAmICalling,
  setCallDetails,
  setCallType,
  setIsCalling,
  // setOnCall,
  setUserToken,
  setRoomName,
  setUserWhoIsCalling,
} from "redux/stores/callingDetails/callingDetails";
import { selectCurrentRoomState } from "redux/stores/currentRoom/currentRoomSlice";
import { User } from "matrix-js-sdk";
import VideoCallModal from "components/VideoCall/VideoCall";

const socket = io("http://localhost:3001");

const ringingSound = new Howl({
  src: ["/ring.mp3"], // Replace with the path to your ringing sound file
  loop: true,
  volume: 1.0,
  onload: () => {
    console.log("Sound loaded successfully!");
  },
  onloaderror: (id, error) => {
    console.error("Failed to load sound:", error);
  },
});

const Layout: FC = () => {
  const { client } = useClientContext();
  const dispatch = useDispatch<AppDispatch>();

  const { callType, isCalling, AmICalling,
    // onCall 
  } = useSelector(selectCallState);

  useEffect(() => {
    socket.on(
      "userCalling",
      (roomId, userWhoIsCalling, membersWhoAreGettingCall, callType) => {
        let userName: User | null = null;
        const id = client.getUserId();
        if (id) {
          userName = client.getUser(id);
        }
                  // console.log("onCall",onCall)
        if (membersWhoAreGettingCall && userName) {
          let isCurrentUserGettingCall = false;
          membersWhoAreGettingCall.forEach((member: string) => {
            if (member == userName?.displayName) {
              isCurrentUserGettingCall = true;
            }
          });
          if (isCurrentUserGettingCall) {
            dispatch(
              setCallDetails({
                isCalling: true,
                userWhoIsCalling: userWhoIsCalling,
                membersWhoAreGettingCall: membersWhoAreGettingCall,
                callType: callType,
                roomName: roomId,
                userToken: "",
                AmICalling: false,
              })
            );
            // dispatch(setOnCall(true));
          } else {
            // dispatch(setIsCalling(null))
            // console.log("not getting call")
          }
        }
      }
    );

    socket.on(
      "userAccepted",
      (userWhoAcceptedCall, userWhoWasCalling, roomName,call_type) => {
        let userName: string | undefined;
        const id = client.getUserId();
        if (id) {
          userName = client.getUser(id)?.displayName;
        }
        console.log("here",userName,userWhoWasCalling)
        if (userName && userWhoWasCalling === userName) {
          videoCallLivekitHandler(roomName, userName,call_type);
        }
      }
    );

    socket.on(
      "userRejected",
      (userWhoRejected, userWhoWasCalling, roomName,membersWhoAreGettingCall) => {
        let userName: string | undefined;
        const id = client.getUserId();
        if (id) {
          userName = client.getUser(id)?.displayName;
        }

        console.log(membersWhoAreGettingCall)
        if (userName && userWhoWasCalling === userName && membersWhoAreGettingCall.length <= 1) {
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
          // dispatch(setOnCall(false));
        }
      }
    );

    socket.on(
      "userCancelled",
      (userWhoCancelled, membersWhoAreGettingCall, roomName) => {
        // console.log("userCancelled", userWhoCancelled, membersWhoAreGettingCall)
        let userName: string | undefined;
        const id = client.getUserId();
        if (id) {
          userName = client.getUser(id)?.displayName;
        }
        const user = membersWhoAreGettingCall.find((member:string)=>member === userName)
        if(user){
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
          // dispatch(setOnCall(false));
        }
      }
    )

    //  return () => {
    //    socket.off('userJoined');
    //    socket.off('userLeft');
    //    socket.off('userRejected');
    //  };
  }, [client]);

  useEffect(() => {
    // console.log("testonCall", onCall);
    if ((AmICalling === true || isCalling === true) ) {
      console.log("ring");
      ringingSound.play();
    } else {
      console.log("ring stops");
      ringingSound.stop();
    }
  }, [isCalling, AmICalling]);

  const videoCallLivekitHandler = async (
    roomName: string,
    userName: string,
    call_type: string,
  ) => {
    try {
      const resp = await fetch(
        `http://localhost:3001/getToken?roomName=${roomName}&participantName=${userName}`
      );
      const token = await resp.text();
      dispatch(setUserToken(token));
      dispatch(setCallType(call_type))
      dispatch(setIsCalling(false));
      dispatch(setAmICalling(false));
      dispatch(setRoomName(roomName));
      // dispatch(setOnCall(true));
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  return (
    <div className="layout-container">
      {(isCalling !== null || AmICalling ) && <VideoCallModal />}
      <Sidebar />
      <Main />
    </div>
  );
};

export default Auth({ component: Layout });
