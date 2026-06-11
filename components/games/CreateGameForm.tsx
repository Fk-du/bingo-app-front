import { useState, FormEvent } from 'react';
import { useCreateGame } from '@/hooks/useGames';
import { ActionButton, Field, TextField } from '@/components/ui/Surface';

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
    <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
      <Field label="Entry Fee">
        <TextField
          type="number"
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
          required
          min="0"
          placeholder="10"
        />
      </Field>
      <Field label="Max Players">
        <TextField
          type="number"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(e.target.value)}
          min="2"
        />
      </Field>
      <Field label="Call Interval" hint="Seconds between automatic calls">
        <TextField
          type="number"
          value={callInterval}
          onChange={(e) => setCallInterval(e.target.value)}
          min="3"
        />
      </Field>
      <ActionButton type="submit" disabled={isPending} className="md:self-end">
        {isPending ? 'Creating...' : 'Create Game'}
      </ActionButton>
    </form>
  );
}
