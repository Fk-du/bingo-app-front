'use client';

const RANGES = [
  { letter: 'B', min: 1, max: 15 },
  { letter: 'I', min: 16, max: 30 },
  { letter: 'N', min: 31, max: 45 },
  { letter: 'G', min: 46, max: 60 },
  { letter: 'O', min: 61, max: 75 },
];

interface NumberBoardProps {
  calledNumbers: Set<number>;
}

export function NumberBoard({ calledNumbers }: NumberBoardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-3">
      <h3 className="text-center font-bold text-zinc-700 mb-2 text-sm uppercase tracking-wide">
        Number Board
      </h3>
      <div className="grid grid-cols-5 gap-0.5">
        {RANGES.map(({ letter, min, max }) => (
          <div key={letter}>
            <div className="h-7 flex items-center justify-center font-bold text-sm text-rose-600 bg-rose-50 rounded-t">
              {letter}
            </div>
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => {
              const isCalled = calledNumbers.has(n);
              return (
                <div
                  key={n}
                  className={`h-5 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs leading-none transition-colors duration-150 ${
                    isCalled
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-zinc-50 text-zinc-400'
                  }`}
                >
                  {n}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
