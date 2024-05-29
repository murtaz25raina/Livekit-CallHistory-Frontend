import { FC, useEffect,useState } from "react";
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
import {
  selectCallHistoryState,
  setCallHistory,
  setCurrentCall,
} from "redux/stores/callHistory/callHistory";

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
  const [usersWhoRejectedTheCall,setUsersWhoRejectedTheCall] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const {
    callType,
    isCalling,
    AmICalling,
    // onCall
  } = useSelector(selectCallState);

  const { calls } = useSelector(selectCallHistoryState);

  useEffect(() => {
    socket.on(
      "userCalling",
      (
        roomId,
        userWhoIsCalling,
        membersWhoAreGettingCall,
        callType,
        callDetail
      ) => {
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
            let allCalls = [...calls];
            console.log("calls", calls);
            let newCallDetail = { ...callDetail };
            newCallDetail["callStatus"] = "missed";
            allCalls.push(newCallDetail);
            dispatch(setCurrentCall(newCallDetail));
            dispatch(setCallHistory(allCalls));
          } else {
            // dispatch(setIsCalling(null))
            // console.log("not getting call")
          }
        }
      }
    );

    socket.on(
      "userAccepted",
      (
        userWhoAcceptedCall,
        userWhoWasCalling,
        roomName,
        call_type,
        callDetail
      ) => {
        let userName: string | undefined;
        const id = client.getUserId();
        if (id) {
          userName = client.getUser(id)?.displayName;
        }
        // console.log("here", userName, userWhoWasCalling);
        if (userName && userWhoWasCalling === userName) {
          let allCalls = [...calls];
          let newCallDetail = { ...callDetail };
          dispatch(setCurrentCall(newCallDetail));
          let filteredCalls = allCalls.filter(
            (c) => c.callId !== callDetail.callId
          );
          filteredCalls.push(newCallDetail);
          dispatch(setCallHistory(filteredCalls));
          videoCallLivekitHandler(roomName, userName, call_type);
        }
      }
    );

    socket.on(
      "userRejected",
      (
        userWhoRejected,
        userWhoWasCalling,
        roomName,
        membersWhoAreGettingCall,
        callDetail
      ) => {
        let userName: string | undefined;
        const id = client.getUserId();
        if (id) {
          userName = client.getUser(id)?.displayName;
        }

        // console.log(membersWhoAreGettingCall);
        // let uWRTC = [...usersWhoRejectedTheCall];
        // let uWRTCF = uWRTC.find((u) => u === userWhoRejected);
        // if(!uWRTCF){
        //   uWRTC.push(userWhoRejected);
        //   setUsersWhoRejectedTheCall(uWRTC);
        // }
        // console.log("see",uWRTC)
        if (
          userName &&
          userWhoWasCalling === userName &&
          (membersWhoAreGettingCall.length <= 1 )
          // || uWRTC.length === membersWhoAreGettingCall.length )
        ) {
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

          let allCalls = [...calls];
          let newCallDetail = { ...callDetail };
          newCallDetail["callStatus"] = "rejected";
          dispatch(setCurrentCall(newCallDetail));
          let filteredCalls = allCalls.filter(
            (c) => c.callId !== callDetail.callId
          );
          filteredCalls.push(newCallDetail);
          dispatch(setCallHistory(filteredCalls));
        }
      }
    );

    socket.on("userLeft",(userWhoCalled,membersGettingCall,roomName,callDetail,mOCallCur)=>{
      let userName: string | undefined;
      const id = client.getUserId();
      if (id) {
        userName = client.getUser(id)?.displayName;
      }
      console.log("test",userWhoCalled , userName)
      if(membersGettingCall){
      const user = membersGettingCall.find(
        (member: string) => member === userName
      );
      if (user || userWhoCalled === userName) {
        let allCalls = [...calls];
        let newCallDetail = { ...callDetail };
        dispatch(setCurrentCall(newCallDetail));
        let filteredCalls = allCalls.filter(
          (c) => c.callId !== callDetail.callId
        );
        filteredCalls.push(newCallDetail);
        dispatch(setCallHistory(filteredCalls));
      }
      // console.log("llll",mOCallCur);
      if(mOCallCur.length <= 1){
      const otherUser = mOCallCur.find(
        (member: string) => member === userName
      );
      // console.log("aaaa",otherUser);
      if(otherUser ){
        dispatch( setCallDetails({
            callType: null,
            userToken: "",
            roomName: "",
            userWhoIsCalling: "",
            membersWhoAreGettingCall: [],
            isCalling: null,
            AmICalling: false,
          }))
        }
        if (user) {
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
          }
      }

    }
    })

    socket.on(
      "userCancelled",
      (userWhoCancelled, membersWhoAreGettingCall, roomName) => {
        // console.log("userCancelled", userWhoCancelled, membersWhoAreGettingCall)
        let userName: string | undefined;
        const id = client.getUserId();
        if (id) {
          userName = client.getUser(id)?.displayName;
        }
        const user = membersWhoAreGettingCall.find(
          (member: string) => member === userName
        );
        if (user) {
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

    //  return () => {
    //    socket.off('userJoined');
    //    socket.off('userLeft');
    //    socket.off('userRejected');
    //  };
  }, [client, calls]);

  useEffect(() => {
    // console.log("testonCall", onCall);
    if (AmICalling === true || isCalling === true) {
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
    call_type: string
  ) => {
    try {
      const resp = await fetch(
        `http://localhost:3001/getToken?roomName=${roomName}&participantName=${userName}`
      );
      const token = await resp.text();
      dispatch(setUserToken(token));
      dispatch(setCallType(call_type));
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
      {(isCalling !== null || AmICalling) && <VideoCallModal />}
      <Sidebar />
      <Main />
    </div>
  );
};

export default Auth({ component: Layout });
