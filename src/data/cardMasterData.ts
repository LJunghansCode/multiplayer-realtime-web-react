import { Card, CardType } from "../models/card";

// record of id to card
const CARDS: Record<string, Card> = {
  ak47: {
    id: "ak47",
    type: CardType.GUN,
  },
  bullet_vest_1: {
    id: "bullet_vest_1",
    type: CardType.ARMOR,
  },
};

export default CARDS;
