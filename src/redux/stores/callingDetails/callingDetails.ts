import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface callState {
    callType: string | null;
    userToken: string;
    roomName: string;
    userWhoIsCalling: string,
    membersWhoAreGettingCall: string[];
    isCalling: boolean | null;
    AmICalling: boolean;
    // onCall : boolean

}
interface callStatePayload {
    callType: string | null;
    userToken: string;
    roomName: string;
    userWhoIsCalling: string,
    membersWhoAreGettingCall: string[];
    isCalling: boolean | null;
    AmICalling: boolean;

}

const initialState: callState = {
  callType : null,
  userToken : "",
  roomName : "",
  userWhoIsCalling : "",
  membersWhoAreGettingCall : [],
  isCalling:null,
  AmICalling: false,
//   onCall:false

};

const callSlice = createSlice({
  name: "callSlice",
  initialState,
  reducers: {
    setCallDetails : (state,action:PayloadAction<callStatePayload>) => {
        state.callType = action.payload.callType;
        state.userToken = action.payload.userToken;
        state.roomName = action.payload.roomName;
        state.userWhoIsCalling = action.payload.userWhoIsCalling;
        state.membersWhoAreGettingCall = action.payload.membersWhoAreGettingCall;
        state.isCalling = action.payload.isCalling;
        state.AmICalling = action.payload.AmICalling;
    },
    setUserToken: (state, action: PayloadAction<string>) => {
        state.userToken = action.payload;
    },
    setCallType: (state, action: PayloadAction<string|null>) => {
        state.callType = action.payload;
  
    },
    setRoomName: (state, action: PayloadAction<string>) => {
        state.roomName = action.payload;
    },
    setUserWhoIsCalling: (state, action: PayloadAction<string>) => {
        state.userWhoIsCalling = action.payload;
    },
    setMembersWhoAreGettingCall: (state, action: PayloadAction<string[]>) => {
        state.membersWhoAreGettingCall = action.payload;
    },
    setIsCalling: (state, action: PayloadAction<boolean|null>) => {
        state.isCalling = action.payload;
    },
    setAmICalling: (state, action: PayloadAction<boolean>) => {
        state.AmICalling = action.payload;
    },
    // setOnCall: (state, action: PayloadAction<boolean>) => {
    //     state.onCall = action.payload;
    // },
  },
});

export const { setCallDetails,setCallType,setRoomName,setUserToken,setUserWhoIsCalling,setMembersWhoAreGettingCall,setIsCalling,setAmICalling } = callSlice.actions;
export const selectCallState = (state: RootState) => state.callDetails;
export default callSlice.reducer;
