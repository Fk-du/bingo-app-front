import { AssignmentStatus } from './enums';

export interface CardResponse {
  id: number;
  numbers: string;
  numbersHash: string;
  used: boolean;
  usageCount: number;
  winRate: number;
  createdAt: string;
}

export interface PlayerCardResponse {
  id: number;
  playerId: number;
  card: CardResponse;
  status: AssignmentStatus;
  gamesPlayed: number;
  gamesWon: number;
  assignedAt: string | null;
  unassignedAt: string | null;
}
