import { useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useGameStore } from '@/store/game.store';
import { CalledNumberResponse, GameStatus } from '@/types';

interface GameEvent {
  type: 'NUMBER_CALLED' | 'GAME_STATUS_CHANGED' | 'BINGO_CLAIM_RESULT';
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
      break;
    case 'BINGO_CLAIM_RESULT':
      break;
  }
}
