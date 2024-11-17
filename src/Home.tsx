import React from "react";
import JoinRoom from "./components/JoinRoom";
import CreateRoom from "./components/CreateRoom";

const Home: React.FC = () => {
  return (
    <div>
      <h1>Two-Player Game</h1>
      <CreateRoom />
      <JoinRoom />
      {/* Add routing or conditional rendering to enter the game room */}
    </div>
  );
};

export default Home;
