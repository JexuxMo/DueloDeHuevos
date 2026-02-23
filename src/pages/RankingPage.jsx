import { MOCK_RANKING } from '../mocks/ranking';

export default function RankingPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">🏆 Ranking Global</h1>

      <div className="bg-gray-800 rounded-xl overflow-hidden border border-yellow-500">
        <table className="w-full">
          <thead className="bg-yellow-900">
            <tr>
              <th className="px-6 py-3 text-left text-white font-bold">Pos</th>
              <th className="px-6 py-3 text-left text-white font-bold">Jugador</th>
              <th className="px-6 py-3 text-left text-white font-bold">Puntos</th>
              <th className="px-6 py-3 text-left text-white font-bold">V/D</th>
              <th className="px-6 py-3 text-left text-white font-bold">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RANKING.map((player, i) => (
              <tr key={i} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">
                  <span
                    className={`font-bold ${
                      i === 0
                        ? 'text-yellow-400 text-xl'
                        : i === 1
                          ? 'text-gray-300 text-lg'
                          : i === 2
                            ? 'text-orange-400'
                            : 'text-white'
                    }`}
                  >
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${player.rank}`}
                  </span>
                </td>
                <td className="px-6 py-4 text-white font-bold">{player.username}</td>
                <td className="px-6 py-4 text-yellow-400 font-bold">{player.points}</td>
                <td className="px-6 py-4 text-green-400">
                  {player.wins}/{player.losses}
                </td>
                <td className="px-6 py-4 text-white">{((player.wins / (player.wins + player.losses)) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
