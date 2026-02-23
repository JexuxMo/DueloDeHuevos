import { X } from 'lucide-react';
import { getCategoryLabel, isCombatEggCategory } from '../utils/cardCategory';

export default function CartaModal({ carta, onClose }) {
  if (!carta) return null;

  const esHuevoCombate = isCombatEggCategory(carta.categoria);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-black text-orange-700">{carta.nombre}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-[2/3] bg-gradient-to-br from-yellow-100 to-orange-200 rounded-xl flex items-center justify-center border-4 border-orange-500">
            <span className="text-9xl">🥚</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Serial</p>
              <p className="font-bold text-lg">{carta.serial}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Categoría</p>
              <p className="font-bold text-lg">{getCategoryLabel(carta.categoria)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Clase</p>
              <p className="font-bold text-lg">{carta.clase}</p>
            </div>

            {esHuevoCombate && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Nivel</p>
                  <div className="flex space-x-1">
                    {[...Array(carta.nivel)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-2xl">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-bold text-lg">{carta.tipo}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ATK</p>
                    <p className="font-bold text-2xl text-red-600">{carta.ataque}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">DEF</p>
                    <p className="font-bold text-2xl text-blue-600">{carta.defensa}</p>
                  </div>
                </div>
              </>
            )}

            {carta.efecto && (
              <div>
                <p className="text-sm text-gray-600 font-bold">Efecto</p>
                <p className="text-sm bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300">{carta.efecto}</p>
              </div>
            )}

            {carta.ambientacion && (
              <div>
                <p className="text-sm text-gray-600 font-bold italic">Texto de Ambientación</p>
                <p className="text-sm italic text-gray-700">{carta.ambientacion}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
