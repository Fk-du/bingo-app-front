import { useState, FormEvent } from 'react';
import { useCreateGame } from '@/hooks/useGames';

export function CreateGameForm() {
  const [entryFee, setEntryFee] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('50');
  const [callInterval, setCallInterval] = useState('5');
  const { mutate, isPending } = useCreateGame();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({
      entryFee: Number(entryFee),
      maxPlayers: Number(maxPlayers),
      callInterval: Number(callInterval),
    });
    setEntryFee('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Entry Fee</label>
        <input
          type="number"
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
          required
          min="0"
          style={inputStyle}
          placeholder="10"
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Max Players</label>
        <input
          type="number"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(e.target.value)}
          min="2"
          style={inputStyle}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Call Interval (s)</label>
        <input
          type="number"
          value={callInterval}
          onChange={(e) => setCallInterval(e.target.value)}
          min="3"
          style={inputStyle}
        />
      </div>
      <button type="submit" disabled={isPending} style={btnStyle}>
        {isPending ? 'Creating...' : 'Create Game'}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: 4,
  width: 100,
};

const btnStyle: React.CSSProperties = {
  background: '#e94560',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: 4,
  cursor: 'pointer',
};
