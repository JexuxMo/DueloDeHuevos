import { useState } from 'react';

export default function GameBoard() {
  const [focusedCard, setFocusedCard] = useState(null);

  const getZoneLabel = (row, col) => {
    if (row === 0) {
      if (col === 0) return 'Enc. Fuerte';
      if (col >= 1 && col <= 6) return `Huevo ${col}`;
      if (col === 7) return 'Basura';
    }

    if (row === 1) {
      if (col === 0) return 'Enc. Débil';
      if (col >= 1 && col <= 3) return `Trampa ${col}`;
      if (col >= 4 && col <= 6) return `Hechizo ${col - 3}`;
      if (col === 7) return 'Biblioteca';
    }

    return '';
  };

  const getZoneColor = (row, col) => {
    if (row === 0) {
      if (col === 0) return 'bg-purple-600 border-purple-400';
      if (col >= 1 && col <= 6) return 'bg-yellow-700 border-yellow-500';
      if (col === 7) return 'bg-gray-700 border-gray-500';
    }

    if (row === 1) {
      if (col === 0) return 'bg-indigo-600 border-indigo-400';
      if (col >= 1 && col <= 3) return 'bg-red-700 border-red-500';
      if (col >= 4 && col <= 6) return 'bg-blue-700 border-blue-500';
      if (col === 7) return 'bg-green-700 border-green-500';
    }

    return 'bg-gray-800 border-gray-600';
  };

  const mockCard = {
    name: 'Huevo Dragón',
    type: 'Huevo de Combate',
    attack: 2500,
    defense: 2000,
    description:
      'Un poderoso huevo dragón que puede destruir cualquier carta en el campo. Cuando es invocado, gana 500 puntos de ataque adicionales.',
    image: '🥚',
  };

  const renderGrid = (zonePrefix) => (
    <div className="grid grid-rows-2 gap-2">
      {[0, 1].map((row) => (
        <div key={`${zonePrefix}-row-${row}`} className="grid grid-cols-8 gap-2">
          {Array(8)
            .fill(null)
            .map((_, col) => (
              <button
                key={`${zonePrefix}-${row}-${col}`}
                onClick={() => setFocusedCard(mockCard)}
                className={`
                  aspect-square rounded-lg border-2 ${getZoneColor(row, col)}
                  hover:opacity-80 transition-all flex flex-col items-center justify-center
                  min-h-[60px] min-w-[60px]
                `}
                title={getZoneLabel(row, col)}
              >
                <span className="text-[10px] text-white text-center px-1 leading-tight">{getZoneLabel(row, col)}</span>
              </button>
            ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">🎮 Tablero de Duelo</h1>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm"
          >
            Cerrar Tablero
          </button>
        </div>

        <div className="mb-6 flex-1 flex flex-col">
          <h2 className="text-lg font-bold text-red-400 mb-2">Zona del Oponente</h2>
          <div className="flex-1 flex items-center justify-center bg-gray-800/50 rounded-xl p-4">{renderGrid('opponent')}</div>
        </div>

        <div className="border-t-2 border-yellow-500 my-2" />

        <div className="flex-1 flex flex-col">
          <h2 className="text-lg font-bold text-green-400 mb-2">Tu Zona de Combate</h2>
          <div className="flex-1 flex items-center justify-center bg-gray-800/50 rounded-xl p-4">{renderGrid('player')}</div>
        </div>
      </div>

      <div className="w-72 bg-gray-900 border-l border-yellow-500 p-4 flex flex-col">
        <h2 className="text-lg font-bold text-yellow-400 mb-4">Carta Enfocada</h2>

        {focusedCard ? (
          <div className="flex-1">
            <div className="bg-gray-800 rounded-xl p-4 border-2 border-yellow-500 mb-4">
              <div className="text-7xl text-center mb-3">{focusedCard.image}</div>
              <h3 className="text-lg font-bold text-white text-center mb-1">{focusedCard.name}</h3>
              <p className="text-yellow-400 text-center text-xs mb-3">{focusedCard.type}</p>
              <div className="flex justify-around text-white text-sm">
                <span>⚔️ {focusedCard.attack}</span>
                <span>🛡️ {focusedCard.defense}</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-yellow-400 font-bold mb-2 text-sm">Descripción</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{focusedCard.description}</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-3">🃏</div>
              <p className="text-gray-400 text-sm">Haz clic en una carta para ver sus detalles</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
