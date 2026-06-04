interface BingoCardProps {
  numbers: number[][];
  calledNumbers: Set<number>;
  isWinner?: boolean;
}

export function BingoCard({ numbers, calledNumbers, isWinner }: BingoCardProps) {
  const bingoLetter = (col: number) => {
    const letters = ['B', 'I', 'N', 'G', 'O'];
    return letters[col];
  };

  return (
    <div style={{ display: 'inline-block', background: '#fff', borderRadius: 8, padding: 8 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 48px)', gap: 2 }}>
        {[0, 1, 2, 3, 4].map((col) => (
          <div key={`header-${col}`} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#e94560', padding: 4 }}>
            {bingoLetter(col)}
          </div>
        ))}
        {numbers.map((row, ri) =>
          row.map((num, ci) => {
            const isMarked = calledNumbers.has(num);
            const isCenter = ri === 2 && ci === 2;
            return (
              <div
                key={`${ri}-${ci}`}
                style={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: isMarked ? 'bold' : 'normal',
                  background: isCenter ? '#ffd700' : isMarked ? '#4ecca3' : '#f0f0f0',
                  color: isMarked ? '#fff' : '#333',
                  borderRadius: 4,
                }}
              >
                {isCenter ? 'FREE' : num}
              </div>
            );
          })
        )}
      </div>
      {isWinner && (
        <div style={{ textAlign: 'center', marginTop: 8, color: '#e94560', fontWeight: 'bold' }}>
          BINGO!
        </div>
      )}
    </div>
  );
}
