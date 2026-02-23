import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { MOCK_DECKS } from '../mocks/decks';

const FILTER_TAGS = ['Tipo', 'Clase', 'Nivel', 'ATK', 'DEF'];

const createCard = (prefix, index) => ({
  id: `${prefix}-${index + 1}`,
  name: `Carta ${index + 1}`,
  serial: `${prefix.toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
});

export default function DeckBuilderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeck, setSelectedDeck] = useState(MOCK_DECKS[0] ?? null);
  const [selectedCard, setSelectedCard] = useState(null);

  const filteredCards = useMemo(() => Array.from({ length: 10 }, (_, i) => createCard('flt', i)), []);
  const libraryCards = useMemo(() => Array.from({ length: 30 }, (_, i) => createCard('lib', i)), []);
  const reserveCards = useMemo(() => Array.from({ length: 10 }, (_, i) => createCard('res', i)), []);

  return (
    <div className="p-6">
      <div className="mb-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <div className="bg-gray-800 border border-yellow-500 px-6 py-3 rounded-xl">
          <h1 className="text-3xl font-black text-white tracking-wide">Constructor de Mazos</h1>
        </div>
        <div className="flex justify-start lg:justify-end">
          <button className="bg-yellow-600 hover:bg-yellow-700 border border-yellow-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nuevo Mazo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <div className="space-y-4">
          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-4 min-h-[290px]">
            <div className="space-y-2">
              {MOCK_DECKS.map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => setSelectedDeck(deck)}
                  className={`w-full border px-4 py-2 text-left font-semibold transition-colors ${
                    selectedDeck?.id === deck.id
                      ? 'bg-yellow-600 text-white border-yellow-400'
                      : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  {deck.name}
                </button>
              ))}
            </div>
            <div className="mt-10 text-center text-gray-500 text-3xl leading-6">\n\n\n</div>
          </section>

          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-5 flex items-center justify-center min-h-[300px]">
            <div className="w-[130px] h-[210px] bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-yellow-500 rounded-lg flex flex-col items-center justify-center px-2 text-center">
              <span className="text-4xl">🥚</span>
              <p className="text-xs mt-2 font-semibold text-gray-900">{selectedCard?.name || 'Sin carta seleccionada'}</p>
              <p className="text-[10px] text-gray-700">{selectedCard?.serial || '---'}</p>
            </div>
          </section>

          <section className="bg-gray-800 border border-yellow-500 rounded-xl overflow-hidden">
            <button className="w-full border-b border-gray-700 py-2 text-white bg-gray-700 hover:bg-gray-600">Guardar</button>
            <button className="w-full border-b border-gray-700 py-2 text-white bg-gray-700 hover:bg-gray-600">Paso Atrás</button>
            <div className="grid grid-cols-2">
              <button className="border-r border-gray-700 py-2 text-white bg-gray-700 hover:bg-gray-600">Eliminar</button>
              <button className="py-2 text-white bg-gray-700 hover:bg-gray-600">Limpiar</button>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-4">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Barra de búsqueda"
                  className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-yellow-500 rounded-lg text-white placeholder:text-gray-400"
                />
              </div>
              <button className="bg-yellow-600 hover:bg-yellow-700 border border-yellow-500 px-4 rounded-lg font-bold text-white">Buscar</button>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {filteredCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="w-20 h-28 bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-yellow-500 rounded-lg hover:brightness-110"
                    title={card.name}
                  />
                ))}
              </div>
            </div>

            <input type="range" className="w-full accent-yellow-500 my-3" />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {FILTER_TAGS.map((tag) => (
                <button
                  key={tag}
                  className="bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white font-bold py-2"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-4">
            <div className="h-[290px] overflow-y-auto pr-1">
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {libraryCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="h-20 bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-yellow-500 rounded-lg hover:brightness-110"
                    title={card.name}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-4">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2 min-w-[700px] md:min-w-0">
                {reserveCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className="h-16 bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-yellow-500 rounded-lg hover:brightness-110"
                    title={card.name}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
