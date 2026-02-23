export const MOCK_RANKING = Array(10)
  .fill(null)
  .map((_, i) => ({
    rank: i + 1,
    username: `Jugador${i + 1}`,
    points: 3000 - i * 100,
    wins: 50 - i,
    losses: 10 + i,
  }));
