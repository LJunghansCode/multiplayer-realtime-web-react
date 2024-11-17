import { Deck } from "./deck";
import { Hand } from "./hand";

export type Player = {
  id: string;
  hand?: Hand;
  deck?: Deck;
};
