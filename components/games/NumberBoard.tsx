'use client';

import { Surface } from '@/components/ui/Surface';

const RANGES = [
  { letter: 'B', min: 1, max: 15, tone: 'cyan' },
  { letter: 'I', min: 16, max: 30, tone: 'emerald' },
  { letter: 'N', min: 31, max: 45, tone: 'violet' },
  { letter: 'G', min: 46, max: 60, tone: 'amber' },
  { letter: 'O', min: 61, max: 75, tone: 'rose' },
] as const;

interface NumberBoardProps {
  calledNumbers: Set<number>;
}

export function NumberBoard({ calledNumbers }: NumberBoardProps) {
  return (
    <Surface className="p-3">
      <h3 className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        Number Board
      </h3>
      <div className="grid grid-cols-5 gap-1">
        {RANGES.map(({ letter, min, max, tone }) => (
          <div key={letter} className="space-y-1">
            <div
              className={`flex h-9 items-center justify-center rounded-xl border text-sm font-semibold uppercase tracking-[0.2em] ${
                tone === 'cyan'
                  ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200'
                  : tone === 'emerald'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                    : tone === 'violet'
                      ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
                      : tone === 'amber'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
              }`}
            >
              {letter}
            </div>
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => {
              const isCalled = calledNumbers.has(n);
              return (
                <div
                  key={n}
                  className={`flex h-5 items-center justify-center rounded-lg border text-[10px] leading-none transition sm:h-6 ${
                    isCalled
                      ? 'border-emerald-400/30 bg-emerald-500/20 font-semibold text-emerald-100'
                      : 'border-slate-800 bg-slate-950/60 text-slate-500'
                  }`}
                >
                  {n}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Surface>
  );
}
