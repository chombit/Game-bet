export type GameState = 'WAITING' | 'COUNTDOWN' | 'FLYING' | 'CRASHED';

export interface PlayerBet {
  id: string;
  username: string;
  betAmount: number;
  cashoutMultiplier?: number;
  profit?: number;
  isActive: boolean;
}

export interface BetSlot {
  amount: number;
  autoCashout: number | null;
  cashedOut: boolean;
}

export interface GameStats {
  totalPlayers: number;
  totalBets: number;
  biggestWin: number;
  averageMultiplier: number;
}

export interface GameEngineState {
  gameState: GameState;
  multiplier: number;
  crashPoint: number;
  countdown: number;
  progress: number;
  balance: number;
  history: number[];
  bet1: BetSlot | null;
  bet2: BetSlot | null;
  playerBets: PlayerBet[];
  stats: GameStats;
}

export interface GameEngineActions {
  placeBet: (betNumber: 1 | 2, amount: number, autoCashout: number | null) => void;
  cashout: (betNumber: 1 | 2) => void;
  startNewRound: () => void;
}

export type GameEngine = GameEngineState & GameEngineActions;
