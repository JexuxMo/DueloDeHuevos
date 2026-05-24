import { getCategoryLabel, isCombatEggCategory } from '../utils/cardCategory';
import { getCardImageBySerial } from '../utils/cardImageMap';

const getColorClase = (clase) => {
  const colores = {
    Clara: 'from-slate-200 to-neutral-300',
    Yema: 'from-yellow-300 to-orange-400',
    Cascarón: 'from-amber-500 to-amber-700',
    Podrido: 'from-gray-600 to-gray-900',
    Hechizo: 'from-pink-400 to-rose-500',
    Trampa: 'from-green-400 to-emerald-500',
    Encantamiento: 'from-indigo-400 to-purple-500',
    'Encantamiento fuerte': 'from-red-500 to-orange-600',
    'Encantamiento débil': 'from-blue-300 to-indigo-400',
    'Encantamiento Fuerte': 'from-red-500 to-orange-600',
    'Encantamiento Débil': 'from-blue-300 to-indigo-400',
  };

  return colores[clase] || 'from-gray-400 to-gray-600';
};

const getIconoClase = (clase) => {
  const iconos = {
    Clara: '💧',
    Yema: '🌟',
    Cascarón: '🛡️',
    Podrido: '💀',
    Hechizo: '✨',
    Trampa: '🪤',
    Encantamiento: '⚡',
    'Encantamiento fuerte': '🔥',
    'Encantamiento débil': '💫',
    'Encantamiento Fuerte': '🔥',
    'Encantamiento Débil': '💫',
  };

  return iconos[clase] || '🥚';
};

export default function CartaComponent({ carta, onClick }) {
  const esHuevoCombate = isCombatEggCategory(carta.categoria);
  const cardImage = getCardImageBySerial(carta.serial);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-3 border-4 border-gray-300 hover:border-yellow-500 transition-all cursor-pointer group transform hover:scale-105 shadow-lg"
    >
      <div
        className={`bg-gradient-to-r ${getColorClase(carta.clase)} rounded-lg p-2 mb-2 flex items-center justify-between`}
      >
        <span className="text-2xl">{getIconoClase(carta.clase)}</span>
        {esHuevoCombate && carta.nivel && (
          <div className="flex space-x-1">
            {[...Array(carta.nivel)].map((_, i) => (
              <span key={i} className="text-yellow-400">
                ⭐
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-lg mb-2 flex items-center justify-center border-2 border-gray-300 overflow-hidden">
        {cardImage ? (
          <img src={cardImage} alt={carta.nombre} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-6xl">🥚</span>
        )}
      </div>

      <h3 className="font-bold text-sm text-center text-gray-800 mb-1 line-clamp-2">{carta.nombre}</h3>

      <p className="text-xs text-center text-gray-600 mb-2">
        {carta.tipo !== 'N/A' ? carta.tipo : getCategoryLabel(carta.categoria)}
      </p>

      {esHuevoCombate && (
        <div className="flex justify-between text-xs font-bold bg-gray-100 rounded p-1">
          <span className="text-red-600">ATK: {carta.ataque}</span>
          <span className="text-blue-600">DEF: {carta.defensa}</span>
        </div>
      )}

      <p className="text-xs text-center text-gray-500 mt-1">{carta.serial}</p>
    </div>
  );
}
