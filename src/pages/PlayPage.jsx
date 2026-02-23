import { Swords, Trophy, Users } from 'lucide-react';

export default function PlayPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Modos de Juego</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-8 border border-yellow-500 hover:border-yellow-400 transition-colors">
          <Swords className="w-16 h-16 text-yellow-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">⚡ Duelo Rápido</h3>
          <p className="text-gray-300 mb-4">Partida rápida contra un oponente aleatorio. Perfecto para practicar.</p>
          <button className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold">Jugar Ahora</button>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 border border-blue-500 hover:border-blue-400 transition-colors">
          <Trophy className="w-16 h-16 text-blue-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">🏆 Clasificatoria</h3>
          <p className="text-gray-300 mb-4">Juega en modo clasificatorio y sube en el ranking global.</p>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">Entrar a Ranked</button>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 border border-green-500 hover:border-green-400 transition-colors">
          <Users className="w-16 h-16 text-green-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">👥 Sala Privada</h3>
          <p className="text-gray-300 mb-4">Crea una sala y juega con tus amigos. Comparte el código de sala.</p>
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold">Crear Sala</button>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 border border-purple-500 hover:border-purple-400 transition-colors">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-2xl font-bold text-white mb-3">🎮 vs IA</h3>
          <p className="text-gray-300 mb-4">Entrena contra la inteligencia artificial. 3 niveles de dificultad.</p>
          <button
            onClick={() => window.open('gameboard.html', '_blank')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
          >
            Practicar
          </button>
        </div>
      </div>
    </div>
  );
}
