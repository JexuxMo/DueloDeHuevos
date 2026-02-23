import { Swords, Trophy, Users } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function HomePage() {
  const { user } = useAuth();
  const winRate =
    user.wins + user.losses > 0 ? ((user.wins / (user.wins + user.losses)) * 100).toFixed(1) : 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">¡Bienvenido, {user?.username}! 🥚</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500">
          <Users className="w-12 h-12 text-yellow-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Jugadores Online</h3>
          <p className="text-4xl font-bold text-yellow-400">847</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-green-500">
          <Trophy className="w-12 h-12 text-green-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Tus Victorias</h3>
          <p className="text-4xl font-bold text-green-400">{user?.wins}</p>
          <p className="text-sm text-gray-400 mt-2">Win Rate: {winRate}%</p>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <h4 className="text-sm font-bold text-red-400 mb-1">Tus Derrotas</h4>
            <p className="text-2xl font-bold text-red-400">{user?.losses}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-purple-500">
          <Swords className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Puntos de Ranking</h3>
          <p className="text-4xl font-bold text-purple-400">{user?.rankPoints}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-xl p-8 border border-yellow-500">
        <h2 className="text-2xl font-bold text-white mb-4">🔥 Partida Rápida</h2>
        <p className="text-gray-300 mb-6">Encuentra un oponente y comienza a jugar inmediatamente</p>
        <button className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-all transform hover:scale-105">
          Buscar Partida
        </button>
      </div>
    </div>
  );
}
