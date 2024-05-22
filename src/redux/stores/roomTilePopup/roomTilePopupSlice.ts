import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface RoomTilePopupState {
  viewRoomTilePopup: string;
  showMore: string;
}

const initialState: RoomTilePopupState = {
  viewRoomTilePopup: "",
  showMore: "",
};

const RoomTilePopupSlice = createSlice({
  name: "roomTilePopup",
  initialState,
  reducers: {
    setViewRoomTilePopup: (state, action: PayloadAction<string>) => {
      state.viewRoomTilePopup = action.payload;
    },
    setShowMore: (state, action: PayloadAction<string>) => {
      state.showMore = action.payload;
    },
  },
});

export const { setViewRoomTilePopup, setShowMore } = RoomTilePopupSlice.actions;
export const selectRoomTilePopupState = (state: RootState) => state.roomTilePopup;
export default RoomTilePopupSlice.reducer;
