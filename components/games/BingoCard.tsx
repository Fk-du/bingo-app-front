interface BingoCardProps {
  numbers: number[][];
  calledNumbers: Set<number>;
  isWinner?: boolean;
}

const letters = ['B', 'I', 'N', 'G', 'O'];

function numberToLetter(n: number): string {
  if (n >= 1 && n <= 15) return 'B';
  if (n >= 16 && n <= 30) return 'I';
  if (n >= 31 && n <= 45) return 'N';
  if (n >= 46 && n <= 60) return 'G';
  if (n >= 61 && n <= 75) return 'O';
  return '';
}

export function BingoCard({ numbers, calledNumbers, isWinner }: BingoCardProps) {
  return (
    <div className="inline-block bg-white rounded-xl shadow-lg p-3">
      <div className="grid grid-cols-5 gap-1">
        {letters.map((letter) => (
          <div
            key={letter}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-lg text-rose-600 bg-rose-50 rounded"
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
                className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-base font-semibold rounded transition-colors duration-200 ${
                  isFree
                    ? 'bg-yellow-400 text-yellow-900'
                    : isCalled
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-100 text-zinc-700'
                }`}
              >
                {isFree ? '★' : num}
              </div>
            );
          })
        )}
      </div>
      {isWinner && (
        <div className="text-center mt-3 text-rose-600 font-bold text-lg animate-pulse">
          🎉 BINGO! 🎉
        </div>
      )}
    </div>
  );
}
