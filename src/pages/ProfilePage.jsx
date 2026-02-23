import { useAuth } from '../context/useAuth';

export default function ProfilePage() {
  const { user } = useAuth();
  const winRate =
    user.wins + user.losses > 0 ? ((user.wins / (user.wins + user.losses)) * 100).toFixed(1) : 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Tu Perfil</h1>
      <div className="bg-gray-800 rounded-xl p-8 border border-yellow-500">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center text-5xl">
            🥚
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
            <p className="text-yellow-400">Nivel 15 • {user?.rankPoints} puntos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Estadísticas</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Victorias:</span>
                <span className="text-green-400 font-bold">{user?.wins}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Derrotas:</span>
                <span className="text-red-400 font-bold">{user?.losses}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Win Rate:</span>
                <span className="text-yellow-400 font-bold">{winRate}%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">Información</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Email:</span>
                <span className="text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Oro:</span>
                <span className="text-yellow-400 font-bold">{user?.gold} 🪙</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Cartas:</span>
                <span className="text-white font-bold">147</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
