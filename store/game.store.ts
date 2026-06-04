import { create } from 'zustand';
import { GameStatus, CalledNumberResponse } from '@/types';

interface GameState {
  activeGameId: number | null;
  gameStatus: GameStatus | null;
  calledNumbers: CalledNumberResponse[];
  totalNumbersCalled: number;
  prizePool: number;
  isConnecting: boolean;
  setActiveGame: (gameId: number) => void;
  setGameStatus: (status: GameStatus) => void;
  addCalledNumber: (number: CalledNumberResponse) => void;
  setCalledNumbers: (numbers: CalledNumberResponse[]) => void;
  setTotalNumbersCalled: (count: number) => void;
  setPrizePool: (pool: number) => void;
  setConnecting: (connecting: boolean) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeGameId: null,
  gameStatus: null,
  calledNumbers: [],
  totalNumbersCalled: 0,
  prizePool: 0,
  isConnecting: true,
  setActiveGame: (gameId) => set({ activeGameId: gameId }),
  setGameStatus: (status) => set({ gameStatus: status }),
  addCalledNumber: (number) =>
    set((state) => ({
      calledNumbers: [...state.calledNumbers, number],
    })),
  setCalledNumbers: (numbers) => set({ calledNumbers: numbers }),
  setTotalNumbersCalled: (count) => set({ totalNumbersCalled: count }),
  setPrizePool: (pool) => set({ prizePool: pool }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  reset: () =>
    set({
      activeGameId: null,
      gameStatus: null,
      calledNumbers: [],
      totalNumbersCalled: 0,
      prizePool: 0,
    }),
}));
