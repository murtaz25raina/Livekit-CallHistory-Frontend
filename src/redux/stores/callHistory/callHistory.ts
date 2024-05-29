import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "redux/app/store";

interface callData  {
    callId : string
    callerName: string;
    callType: string;
    callTime: string;
    callStartTime: string;
    callEndTime: string;
    callStatus: string;
    recieverName: string;
}


interface CallHistory {
    currentCall :callData
    calls : callData[];     
}

const initialState : CallHistory = {
    currentCall : {
        callId : "",
        callerName: "",
        callType: "",
        callTime:"",
        callStartTime: "",
        callEndTime: "",
        callStatus: "",
        recieverName: "",
    },
    calls : []
}

const callHistorySlice = createSlice({
    name: 'callHistory',
    initialState,
    reducers:{
        setCallHistory: (state, action: PayloadAction<callData[]>) => {
            state.calls = action.payload;
        },
        setCurrentCall: (state, action: PayloadAction<callData>) => {
            state.currentCall = action.payload;
        },
    }
})

export const { setCallHistory,setCurrentCall } = callHistorySlice.actions;

export const selectCallHistoryState = (state: RootState) => state.callHistory;

export default callHistorySlice.reducer;