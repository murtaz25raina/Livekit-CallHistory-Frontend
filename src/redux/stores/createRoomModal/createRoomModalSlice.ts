import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface CreateRoomModalState {
    isCreateRoomModelOpen: boolean;
    roomName: string;
}

const initialState: CreateRoomModalState = {
    isCreateRoomModelOpen: false,
    roomName: ""
};

const CreateRoomModalSlice = createSlice({
  name: "createRoomModal",
  initialState,
  reducers: {
    setIsCreateRoomModelOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateRoomModelOpen = action.payload;
    },
    setRoomName: (state, action: PayloadAction<string>) => {
      state.roomName = action.payload;
    },
  },
});

export const { setIsCreateRoomModelOpen, setRoomName } = CreateRoomModalSlice.actions;
export const selectCreateRoomModalState = (state: RootState) => state.createRoomModal;
export default CreateRoomModalSlice.reducer;
