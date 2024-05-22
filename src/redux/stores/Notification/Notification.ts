import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface Notification {
  roomId: string;
  unReadNotificationCount: number;
}

interface NotificationState {
  roomsNotification: Notification[];
}

const initialState: NotificationState = {
    roomsNotification: [],
};

const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setRoomNotification: (state, action: PayloadAction<Notification[]>) => {
      state.roomsNotification = action.payload;
    },
  },
});

export const { setRoomNotification } = NotificationSlice.actions;
export const selectNotificationState = (state: RootState) => state.notification;
export default NotificationSlice.reducer;
