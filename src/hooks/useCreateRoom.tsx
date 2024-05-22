import { useCallback } from "react";
import { useClientContext } from "../providers/ClientProvider";
import { ICreateRoomOpts, Visibility } from "matrix-js-sdk";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCreateRoomModalState,
  setRoomName,
} from "../redux/stores/createRoomModal/createRoomModalSlice";
import { AppDispatch } from "../redux/app/store";
import { setLocalStorage } from "../helpers/localStorage";
import * as sdk from "matrix-js-sdk";
import { toast } from "react-toastify";

interface CreateRoomHook {
  roomName: string;
  createRoom: (roomName: string, users: string[]) => Promise<void>;
}

const useCreateRoom = (): CreateRoomHook => {
  const { roomName } = useSelector(selectCreateRoomModalState);
  const { client } = useClientContext();
  const dispatch = useDispatch<AppDispatch>();
  const createRoom = useCallback(
    async (roomName: string, users: string[]) => {
      try {
        const option: sdk.ICreateRoomOpts = {
          visibility: sdk.Visibility.Public,
          invite: users,
          room_alias_name: roomName,
        };
        const response = await client?.createRoom(option);
        setLocalStorage({ key: "room_id", value: response?.room_id as string });
        dispatch(setRoomName(""));
        toast.success("Room created successfully");
      } catch (error) {
        console.error("Error creating room:", error);
        toast.error("Error while creating room");
      }
    },
    [client, dispatch]
  );

  return {
    roomName,
    createRoom,
  };
};

export default useCreateRoom;
