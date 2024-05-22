import { FC } from "react";
import {  Room } from "matrix-js-sdk";
import RoomTile from "./RoomTile/RoomTile";
import "./RoomList.css";
import { TypingIndicatorProvider } from "../../providers/TypingIndicatorProvider";
import useRoomList from "hooks/useRoomList";

const RoomList: FC = () => {
  const { rooms } = useRoomList();

  return (
    <TypingIndicatorProvider>
      <div className="room-list-container">
        {rooms?.map((room: Room, index: number) => (
          <RoomTile key={room.roomId} room={room} roomId={room.roomId} />
        ))}
      </div>
    </TypingIndicatorProvider>
  );
};

export default RoomList;
