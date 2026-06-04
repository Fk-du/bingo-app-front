import { useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useGameStore } from '@/store/game.store';
import { CalledNumberResponse, GameStatus, BingoClaimResponse } from '@/types';

interface GameEvent {
  type: 'NUMBER_CALLED' | 'GAME_STATUS_CHANGED' | 'CLAIM_PENDING' | 'CLAIM_RESOLVED';
  data: Record<string, unknown>;
}

export function useGameWebSocket(gameId: number | null) {
  const clientRef = useRef<Client | null>(null);
  const {
    addCalledNumber,
    setGameStatus,
    setCalledNumbers,
    setTotalNumbersCalled,
    setPrizePool,
    setConnecting,
    setClaimPending,
    reset,
  } = useGameStore();

  useEffect(() => {
    if (!gameId) return;

    setConnecting(true);

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnecting(false);
        client.subscribe(`/topic/game/${gameId}`, (message: IMessage) => {
          try {
            const event: GameEvent = JSON.parse(message.body);
            handleGameEvent(event);
          } catch {
            console.error('Failed to parse game event');
          }
        });
      },
      onDisconnect: () => {
        setConnecting(true);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      reset();
      client.deactivate();
    };
  }, [gameId]);

  return clientRef.current;
}

function handleGameEvent(event: GameEvent) {
  const store = useGameStore.getState();

  switch (event.type) {
    case 'NUMBER_CALLED':
      store.addCalledNumber(event.data as unknown as CalledNumberResponse);
      break;
    case 'GAME_STATUS_CHANGED':
      store.setGameStatus(event.data.status as GameStatus);
      if (event.data.status === 'IN_PROGRESS') {
        store.setClaimPending(null);
      }
      break;
    case 'CLAIM_PENDING':
      store.setGameStatus(GameStatus.CLAIM_PENDING);
      store.setClaimPending(event.data as unknown as BingoClaimResponse);
      break;
    case 'CLAIM_RESOLVED':
      store.setGameStatus(event.data.status as GameStatus);
      store.setClaimPending(null);
      break;
  }
}
