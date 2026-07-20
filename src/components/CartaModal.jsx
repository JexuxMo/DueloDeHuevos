import { useEffect } from 'react'; // 1. Importar useEffect
import { X } from 'lucide-react';
import { getCategoryLabel, isCombatEggCategory } from '../utils/cardCategory';
import { getCardImageBySerial } from '../utils/cardImageMap';

export default function CartaModal({ carta, onClose }) {

  //Añadir el bloqueo de scroll
  useEffect(() => {
    if (carta) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;
      
      // Aplicar estilos al body para bloquear el scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';

      // Función de limpieza: se ejecuta cuando el modal se cierra
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        
        // Restaurar el scroll a donde estaba el usuario
        window.scrollTo(0, scrollY);
      };
    }
  }, [carta]); // Se ejecuta cada vez que 'carta' cambia (se abre o cierra)

  if (!carta) return null;

  const esHuevoCombate = isCombatEggCategory(carta.categoria);
  const cardImage = getCardImageBySerial(carta.serial);

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
          <div className="aspect-[4/9] bg-gradient-to-br from-yellow-100 to-orange-200 rounded-xl flex items-center justify-center overflow-hidden">
            {cardImage ? (
              <img src={cardImage} alt={carta.nombre} className="w-full h-full object-contain bg-white" />
            ) : (
              <span className="text-9xl">🥚</span>
            )}
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
                   <p className="text-sm text-gray-600">Rango</p>
                   <div className="flex space-x-1">
                     <span className="font-bold text-lg">{carta.nivel}</span>
                   </div>
                 </div>

                 <div>
                   <p className="text-sm text-gray-600">Tipo</p>
                   <p className="font-bold text-lg">{carta.tipo}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-sm text-gray-600">ATA</p>
                     <p className="font-bold text-2xl text-red-600 text-red-600">{carta.ataque}</p>
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
                <div className="text-sm bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300 max-h-28 overflow-y-auto">
                  {carta.efecto}
                </div>
              </div>
            )}

            {carta.ambientacion && (
              <div>
                <p className="text-sm text-gray-600 font-bold italic">Texto de Ambientación</p>
                <div className="text-sm italic text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-300 max-h-24 overflow-y-auto">
                  {carta.ambientacion}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
