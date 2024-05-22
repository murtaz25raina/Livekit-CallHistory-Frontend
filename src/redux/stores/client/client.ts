import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { createClient, MatrixClient } from "matrix-js-sdk";
import environment from "environments/environments";

interface ClientState {
  client: MatrixClient;
  isLoading: boolean;
}

const initialState: ClientState = {
  client: createClient({ baseUrl: environment.baseURL }),
  isLoading: false,
};

const ClientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClient: (state, action: PayloadAction<MatrixClient>) => {
      state.client = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setClient, setIsLoading } = ClientSlice.actions;
export const selectClientState = (state: RootState) => state.client;
export default ClientSlice.reducer;
