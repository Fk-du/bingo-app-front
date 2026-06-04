import { create } from 'zustand';
import { GameStatus, CalledNumberResponse, BingoClaimResponse } from '@/types';

interface GameState {
  activeGameId: number | null;
  gameStatus: GameStatus | null;
  calledNumbers: CalledNumberResponse[];
  totalNumbersCalled: number;
  prizePool: number;
  playerCard: number[][] | null;
  isConnecting: boolean;
  claimPending: BingoClaimResponse | null;
  setActiveGame: (gameId: number) => void;
  setGameStatus: (status: GameStatus) => void;
  addCalledNumber: (number: CalledNumberResponse) => void;
  setCalledNumbers: (numbers: CalledNumberResponse[]) => void;
  setTotalNumbersCalled: (count: number) => void;
  setPrizePool: (pool: number) => void;
  setPlayerCard: (card: number[][] | null) => void;
  setConnecting: (connecting: boolean) => void;
  setClaimPending: (claim: BingoClaimResponse | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeGameId: null,
  gameStatus: null,
  calledNumbers: [],
  totalNumbersCalled: 0,
  prizePool: 0,
  playerCard: null,
  isConnecting: true,
  claimPending: null,
  setActiveGame: (gameId) => set({ activeGameId: gameId }),
  setGameStatus: (status) => set({ gameStatus: status }),
  addCalledNumber: (number) => set((state) => ({ calledNumbers: [...state.calledNumbers, number] })),
  setCalledNumbers: (numbers) => set({ calledNumbers: numbers }),
  setTotalNumbersCalled: (count) => set({ totalNumbersCalled: count }),
  setPrizePool: (pool) => set({ prizePool: pool }),
  setPlayerCard: (card) => set({ playerCard: card }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  setClaimPending: (claim) => set({ claimPending: claim }),
  reset: () => set({
    activeGameId: null, gameStatus: null, calledNumbers: [],
    totalNumbersCalled: 0, prizePool: 0, playerCard: null, claimPending: null,
  }),
}));
