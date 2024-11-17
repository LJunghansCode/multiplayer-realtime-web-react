import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";
import { db, auth } from "../firebase";
import { GameState } from "../models/gamestate";
import { Room } from "../models/room";
import { initSelfInGame } from "../db/game";

const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [otherPlayerId, setOtherPlayerId] = useState<string | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);

  useEffect(() => {
    if (!roomData?.activeGameId) return;

    const gameId = roomData.activeGameId;

    const gameRef = ref(db, `games/${gameId}`);

    const unsubscribe = onValue(gameRef, (snapshot) => {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) {
        throw new Error("User is not authenticated");
      }
      const data: GameState = snapshot.val();
      if (data) {
        setGameState(data);
        // Check if it's the current user's turn
        setIsPlayerTurn(data.currentTurn === currentUserId);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomData]);

  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomId}`);

    // Set up a listener for room data
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data: Room = snapshot.val();
      if (data) {
        setRoomData(data);

        const currentUserId = auth.currentUser?.uid;
        const { player1, player2 } = data.players;

        // Determine other player
        if (currentUserId) {
          if (player1 !== currentUserId) {
            setOtherPlayerId(player1);
          } else if (player2 && player2 !== currentUserId) {
            setOtherPlayerId(player2);
          } else {
            setOtherPlayerId(null);
          }
        }
      } else {
        // Handle room deletion or error
        console.error("Room does not exist.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [roomId]);

  const handleMakeMove = () => {
    if (!isPlayerTurn || !roomData || !gameState) return;

    // Implement your move logic here
    const newGameState = {
      ...gameState,
      // Update game state as per move
      currentTurn: otherPlayerId, // Switch turn
    };

    const gameStateRef = ref(db, `games/${gameState.id}`);
    update(gameStateRef, newGameState).catch((error) => {
      console.error("Error updating game state:", error);
    });
  };

  if (!roomData || (otherPlayerId && !gameState)) {
    return <div>Loading room data...</div>;
  }

  const initSelf = async () => {
    if (!auth.currentUser?.uid) {
      throw new Error("User is not authenticated");
    }
    initSelfInGame(roomData.activeGameId, auth.currentUser?.uid);
  };

  return (
    <div>
      <h2>Game Room: {roomId}</h2>
      <p>
        You are Player:{" "}
        {roomData.players.player1 === auth.currentUser?.uid ? "1" : "2"}
      </p>
      <p>
        Other Player ID:{" "}
        {otherPlayerId ? otherPlayerId : "Waiting for player..."}
      </p>

      {/* Display game state */}
      <div>
        <h3>Game State</h3>
        {/* Render your game board or state here */}
        <p>
          Current Turn:{" "}
          {gameState && gameState.currentTurn === auth.currentUser?.uid
            ? "Your turn"
            : "Opponent's turn"}
        </p>
        {/* Implement game board rendering */}
      </div>

      {/* Implement game actions */}
      {isPlayerTurn ? (
        <button onClick={handleMakeMove}>Make a Move</button>
      ) : (
        <p>Waiting for opponent's move...</p>
      )}

      <button onClick={initSelf}>Initialize Self</button>
    </div>
  );
};

export default GameRoom;
