import { ref, set, get } from "firebase/database";
import { db, auth } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { GameState } from "../models/gamestate";
import { Room } from "../models/room";
import { Player } from "../models/player";
import { Hand } from "../models/hand";
import { getStarterDeck } from "../data/decks/starter";

export const createRoom = async (password: string): Promise<string> => {
  const roomId = uuidv4();
  const gameId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const firstHand: Hand = {
    cards: [],
  };

  const player1: Player = {
    id: userId,
    hand: firstHand,
    deck: getStarterDeck(),
  };

  const newGame: GameState = {
    id: gameId,
    currentTurn: userId,
    player1Id: userId,
  };

  const newRoom: Room = {
    id: roomId,
    password: hashedPassword,
    players: {
      player1: player1.id,
    },
    activeGameId: gameId,
  };

  await set(ref(db, `rooms/${roomId}`), newRoom);
  await set(ref(db, `games/${gameId}`), newGame);
  await set(ref(db, `games/${gameId}/player1Id`), player1.id);

  return roomId;
};

export const joinRoom = async (
  roomId: string,
  password: string
): Promise<boolean> => {
  const roomRef = ref(db, `rooms/${roomId}`);

  console.log(roomRef);
  const snapshot = await get(roomRef);
  console.log(snapshot);

  if (snapshot.exists()) {
    const roomData = snapshot.val();
    const passwordMatch = await bcrypt.compare(password, roomData.password);

    if (passwordMatch) {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        throw new Error("User is not authenticated");
      }

      // Check if player2 slot is available
      if (!roomData.players.player2) {
        const player2: Player = {
          id: userId,
        };
        // Add player2 to game
        await set(
          ref(db, `games/${roomData.activeGameId}/player2Id`),
          player2.id
        );
        await set(ref(db, `rooms/${roomId}/players/player2`), player2.id);
        return true;
      } else {
        throw new Error("Room is full");
      }
    } else {
      throw new Error("Incorrect password");
    }
  } else {
    throw new Error("Room does not exist");
  }
};
