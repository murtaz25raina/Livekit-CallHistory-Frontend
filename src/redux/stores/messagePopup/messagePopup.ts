import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface MessagePopupState {
  viewMessagePopup: string;
  showMore: string;
}

const initialState: MessagePopupState = {
  viewMessagePopup: "",
  showMore: "",
};

const MessagePopupSlice = createSlice({
  name: "messagePopup",
  initialState,
  reducers: {
    setViewMessagePopup: (state, action: PayloadAction<string>) => {
      state.viewMessagePopup = action.payload;
    },
    setShowMore: (state, action: PayloadAction<string>) => {
      state.showMore = action.payload;
    },
  },
});

export const { setViewMessagePopup, setShowMore } = MessagePopupSlice.actions;
export const selectMessagePopupState = (state: RootState) => state.messagePopup;
export default MessagePopupSlice.reducer;
