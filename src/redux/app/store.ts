import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../stores/message/messageSlice";
import currentRoomReducer from "../stores/currentRoom/currentRoomSlice";
import roomReducer from "../stores/room/roomSlice";
import createRoomModalReducer from "../stores/createRoomModal/createRoomModalSlice";
import messagePopupReducer from "../stores/messagePopup/messagePopup";
import roomTilePopupReducer from "../stores/roomTilePopup/roomTilePopupSlice";
import presenceReducer from "../stores/presence/presenceSlice";
import clientReducer from "../stores/client/client";
import NotificationReducer from "../stores/Notification/Notification";
import callDetailsReducer from "../stores/callingDetails/callingDetails";
import callHistoryReducer from "../stores/callHistory/callHistory";

export const store = configureStore({
  reducer: {
    message: messageReducer,
    currentRoom: currentRoomReducer,
    room: roomReducer,
    createRoomModal: createRoomModalReducer,
    messagePopup: messagePopupReducer,
    roomTilePopup: roomTilePopupReducer,
    presence: presenceReducer,
    client: clientReducer,
    notification: NotificationReducer,
    callDetails : callDetailsReducer,
    callHistory : callHistoryReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
