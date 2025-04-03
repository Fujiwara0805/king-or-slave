export type Team = 'king' | 'slave';
export type CardType = 'king' | 'slave' | 'citizen' | 'citizen1' | 'citizen2' | 'citizen3' | 'citizen4';

export interface CardState {
  index: number;
  type: CardType;
  used: boolean;
}

export interface Card {
  id: string;
  type: CardType;
  image: string;
  selected?: boolean;
  originalType?: string;
}

export interface GameState {
  points: number;
  team?: Team;
  betAmount: number;
  round: number;
  cardStates: CardState[];
  cards: Card[];
  selectedCard?: Card;
  cpuCard?: Card;
  result?: 'win' | 'lose' | 'draw';
  gameOver?: boolean;
}