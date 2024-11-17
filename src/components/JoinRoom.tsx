// src/components/JoinRoom.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../db/rooms";

const JoinRoom: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    console.log(roomId, password);
    try {
      const success = await joinRoom(roomId, password);
      console.log(success);
      if (success) {
        navigate(`/room/${roomId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Join Room</h2>
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter room password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoom;
