export type GameState = {
  id: string;
  player1Id: string;
  player2Id?: string;
  player1Board?: {
    activeCard: string;
    hand: string[];
    deck: string[];
  };
  player2Board?: {
    activeCard: string;
    hand: string[];
    deck: string[];
  };
  currentTurn: string;
};
