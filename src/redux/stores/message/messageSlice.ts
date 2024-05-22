import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { IEvent, MatrixEvent } from "matrix-js-sdk";

interface MessageState {
  messages: MatrixEvent[];
  message: string;
}

const initialState: MessageState = {
  messages: [],
  message: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<MatrixEvent[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<MatrixEvent>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<{eventId: string, event: Partial<IEvent>}>) => {
      const { eventId, event } = action.payload;
      const messageevent = state.messages.find((message) => message.event.event_id === eventId) as MatrixEvent;
      messageevent["event"] = event;
      state.messages = state.messages.map(message => 
        message.event.event_id === eventId ? messageevent : message
      );
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const { setMessages, addMessage, setMessage, updateMessage } = messageSlice.actions;
export const selectMessageState = (state: RootState) => state.message;
export default messageSlice.reducer;
