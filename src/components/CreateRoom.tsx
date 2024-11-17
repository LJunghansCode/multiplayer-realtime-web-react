// src/components/CreateRoom.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../db/rooms";

const CreateRoom: React.FC = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      const roomId = await createRoom(password);
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create Room</h2>
      <input
        type="password"
        placeholder="Set a room password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default CreateRoom;
