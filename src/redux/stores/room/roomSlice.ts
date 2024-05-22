import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room } from "matrix-js-sdk";
import { RootState } from "../../app/store";

interface RoomState {
  rooms: Room[];
  deleteRoomId: string;
}

const initialState: RoomState = {
  rooms: [],
  deleteRoomId: "",
};

const RoomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload
    }
  },
});

export const { setRooms } = RoomSlice.actions;
export const selectRoomState = (state: RootState) => state.room;
export default RoomSlice.reducer;
