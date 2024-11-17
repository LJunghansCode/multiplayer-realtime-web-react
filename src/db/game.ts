import { getStarterDeck } from "../data/decks/starter";
import { db } from "../firebase";
import { ref, set, get } from "firebase/database";

const initSelfInGame = async (gameId: string, userId: string) => {
  console.log("HERE");
  const gameRef = ref(db, `games/${gameId}`);
  const gameSnapshot = await get(gameRef);
  if (gameSnapshot.exists()) {
    const gameData = gameSnapshot.val();
    console.log(gameData.player1Id, userId);
    if (gameData.player1Id == userId) {
      console.log("IM PLAYER 1");
      await set(ref(db, `games/${gameId}/player1Board`), {
        activeCard: "",
        hand: [],
        deck: getStarterDeck(),
      });
    } else if (gameData.player2Id == userId) {
      console.log("IM PLAYER 2");
      await set(ref(db, `games/${gameId}/player2Board`), {
        activeCard: "",
        hand: [],
        deck: getStarterDeck(),
      });
    }
  }
};

export { initSelfInGame };
