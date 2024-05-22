import { useEffect } from "react";
import { useClientContext } from "../providers/ClientProvider";
import { ClientEvent, Room } from "matrix-js-sdk";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentRoomState,
  setCurrentRoom,
} from "../redux/stores/currentRoom/currentRoomSlice";

const useRoom = (): Room => {
  const { client } = useClientContext();
  const { currentRoomId, currentRoom } = useSelector(selectCurrentRoomState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!client || !currentRoomId) return;

    const handleSync = () => {
      const syncState = client.getSyncState();

      if (syncState === "PREPARED" || syncState === "SYNCING") {
        dispatch(setCurrentRoom(client.getRoom(currentRoomId) as Room));
      }
    };
    handleSync();
    client.on(ClientEvent.Sync, handleSync);
    return () => {
      if (client) {
        client.off(ClientEvent.Sync, handleSync);
      }
    };
  }, [client, currentRoomId, dispatch, currentRoom]);

  return currentRoom as Room;
};

export default useRoom;
