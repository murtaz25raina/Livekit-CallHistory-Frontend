import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room } from "matrix-js-sdk";
import { setLocalStorage } from "../../../helpers/localStorage";
import { RootState } from "../../app/store";

interface CurrentRoomState {
  currentRoomId: string;
  currentRoom: Room | null;
}

const initialState: CurrentRoomState = {
  currentRoomId: "",
  currentRoom: null,
};

const currentRoomSlice = createSlice({
  name: "currentRoom",
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<Room>) => {
      state.currentRoom = action.payload;
    },
    setCurrentRoomId: (state, action: PayloadAction<string>) => {
      state.currentRoomId = action.payload;
      setLocalStorage({ key: "current_room", value: state.currentRoomId });
    },
  },
});

export const { setCurrentRoom, setCurrentRoomId } = currentRoomSlice.actions;
export const selectCurrentRoomState = (state: RootState) => state.currentRoom;
export default currentRoomSlice.reducer;
