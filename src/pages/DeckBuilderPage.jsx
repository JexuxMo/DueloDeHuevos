import { useState } from 'react';
import { Book, Filter, Plus, Search } from 'lucide-react';
import { MOCK_DECKS } from '../mocks/decks';

export default function DeckBuilderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeck, setSelectedDeck] = useState(null);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Constructor de Mazos</h1>
        <button className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg">
          <Plus className="w-5 h-5" />
          <span>Nuevo Mazo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl p-4 border border-yellow-500">
            <h3 className="text-lg font-bold text-white mb-4">Tus Mazos</h3>
            <div className="space-y-3">
              {MOCK_DECKS.map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => setSelectedDeck(deck)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                    selectedDeck?.id === deck.id
                      ? 'bg-yellow-600 border-yellow-400'
                      : 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">{deck.name}</h4>
                    <span className="text-yellow-400">{deck.cards} cartas</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {deck.wins}V - {deck.losses}D
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500">
            <div className="mb-6">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar cartas..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <button className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {selectedDeck ? (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Editando: {selectedDeck.name}</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[2/3] bg-gradient-to-br from-yellow-900 to-orange-900 rounded-lg border border-yellow-500 flex items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors"
                    >
                      <span className="text-4xl">🥚</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Selecciona un mazo o crea uno nuevo para empezar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
