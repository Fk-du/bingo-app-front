import { GameStatus } from './enums';
import { CardResponse, PlayerCardResponse } from './card';

export interface CreateGameRequest {
  entryFee: number;
  maxPlayers?: number;
  winningPattern?: string;
  callInterval?: number;
}

export interface GameSettingsUpdateRequest {
  maxPlayers?: number;
  callInterval?: number;
  winningPattern?: string;
}

export interface GameResponse {
  id: number;
  agentId: number;
  status: GameStatus;
  entryFee: number;
  maxPlayers: number;
  currentCallIndex: number;
  totalNumbersCalled: number;
  prizePool: number;
  winningPattern: string | null;
  callInterval: number | null;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
}

export interface CalledNumberResponse {
  id: number;
  gameId: number;
  number: number;
  sequenceIndex: number;
  calledAt: string | null;
}

export interface GameStateResponse {
  gameId: number;
  status: GameStatus;
  currentCallIndex: number;
  totalNumbersCalled: number;
  calledNumbers: number[];
  prizePool: number;
  playerCard: number[][] | null;
  hasPlayerCard: boolean;
  isWinner: boolean;
}

export interface BingoClaimResponse {
  id: number;
  gameId: number;
  playerId: number;
  cardId: number;
  cardSnapshot: string | null;
  calledNumbersSnapshot: string | null;
  result: string;
  rewardAmount: number | null;
  claimedAt: string | null;
  validatedAt: string | null;
}

export interface BingoClaimResultResponse {
  valid: boolean;
  claimId?: number;
  pendingReview?: boolean;
  gameEnded?: boolean;
  approvedCount?: number;
  rewardAmount: number;
  platformFee: number;
  agentCommission: number;
}

export interface RegisterResponse {
  gameId: number;
  cardId: number;
}

export interface AdminGameStateResponse {
  gameId: number;
  status: GameStatus;
  entryFee: number;
  maxPlayers: number;
  currentCallIndex: number;
  totalNumbersCalled: number;
  prizePool: number;
  winningPattern: string | null;
  callInterval: number | null;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
  calledNumbers: number[];
  playerCount: number;
}

export interface GameCardResponse {
  id: number;
  gameId: number;
  playerId: number;
  card: CardResponse;
  winner: boolean;
  createdAt: string;
}
