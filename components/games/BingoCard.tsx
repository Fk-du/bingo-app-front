interface BingoCardProps {
  numbers: number[][];
  calledNumbers: Set<number>;
  isWinner?: boolean;
}

const letters = ['B', 'I', 'N', 'G', 'O'];
const letterColors = [
  'bg-bp-primary/20 text-bp-primary',
  'bg-bp-success/20 text-emerald-300',
  'bg-bp-warning/20 text-amber-300',
  'bg-bp-gold/20 text-bp-gold',
  'bg-bp-danger/20 text-red-300',
];

export function BingoCard({ numbers, calledNumbers, isWinner }: BingoCardProps) {
  return (
    <div className="w-full rounded-2xl border border-bp-border bg-bp-bg p-3">
      <div className="grid grid-cols-5 gap-1.5">
        {letters.map((letter, index) => (
          <div
            key={letter}
            className={`flex aspect-square items-center justify-center rounded-lg text-sm font-bold tracking-wider ${letterColors[index]}`}
          >
            {letter}
          </div>
        ))}

        {numbers.map((row, ri) =>
          row.map((num, ci) => {
            const isCalled = calledNumbers.has(num);
            const isFree = ri === 2 && ci === 2;
            return (
              <div
                key={`${ri}-${ci}`}
                className={`flex aspect-square items-center justify-center rounded-lg border text-sm font-semibold transition ${
                  isFree
                    ? 'border-bp-gold/50 bg-bp-gold/20 text-bp-gold'
                    : isCalled
                      ? 'border-bp-danger/50 bg-bp-danger text-white shadow-[0_0_12px_rgba(235,87,87,0.4)]'
                      : 'border-bp-border bg-bp-surface-elevated text-bp-text'
                }`}
              >
                {isFree ? '★' : num}
              </div>
            );
          })
        )}
      </div>

      {isWinner && (
        <div className="mt-3 rounded-xl border border-bp-success/40 bg-bp-success/15 px-4 py-3 text-center text-sm font-semibold text-emerald-300">
          Bingo confirmed!
        </div>
      )}
    </div>
  );
}
