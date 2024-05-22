import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface PresenceState {
  presence: string[];
}

const initialState: PresenceState = {
  presence: [],
};

const PresenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    setPresence: (
      state,
      action: PayloadAction<{ userId: string; presenceValue: string }>
    ) => {
      const { userId, presenceValue } = action.payload;

      if (presenceValue === "online" && !state.presence.includes(userId)) {
        state.presence.push(userId);
      } else if (presenceValue !== "online") {
        state.presence = state.presence.filter((user) => user !== userId);
      }
    },
  },
});

export const { setPresence } = PresenceSlice.actions;
export const selectPresenceState = (state: RootState) => state.presence;
export default PresenceSlice.reducer;
