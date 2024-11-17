export enum CardType {
  "GUN",
  "ARMOR",
}

export type Card = {
  id: string;
  type: CardType;
};
