import { Deck } from "../../models/deck";
import CARDS from "../cardMasterData";

const getStarterDeck = () => {
  const starterDeck: Deck = {
    cards: [CARDS.ak47, CARDS.bullet_vest_1],
  };
  return starterDeck;
};

export { getStarterDeck };
