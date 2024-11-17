export type Room = {
  id: string;
  activeGameId: string;
  password: string;
  players: {
    player1: string;
    player2?: string;
  };
};
