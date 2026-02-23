import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import CartaComponent from '../components/CartaComponent';
import CartaModal from '../components/CartaModal';
import { CATEGORY_ORDER, getCategoryLabel } from '../utils/cardCategory';
import { parseCardsPayload } from '../types/card';

export default function CollectionPage() {
  /** @type {[import('../types/card').Card[], Function]} */
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedCarta, setSelectedCarta] = useState(null);

  useEffect(() => {
    fetch('/data/cardsS1.json')
      .then((response) => response.json())
      .then((data) => {
        const payload = Array.isArray(data) ? data : [];
        const { cards, invalidCount } = parseCardsPayload(payload);

        if (invalidCount > 0) {
          console.warn(`Se descartaron ${invalidCount} cartas con formato inválido.`);
        }

        setCartas(cards);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar las cartas.');
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const keys = [...new Set(cartas.map((carta) => carta.categoria))];
    const existingOrdered = CATEGORY_ORDER.filter((key) => keys.includes(key));
    const extras = keys.filter((key) => !CATEGORY_ORDER.includes(key)).sort();
    return ['todas', ...existingOrdered, ...extras];
  }, [cartas]);

  const filteredCartas = cartas.filter((carta) => {
    const matchesSearch = carta.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || carta.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-white text-xl">Cargando cartas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-300 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Tu Colección</h1>
        <div className="text-white">
          <span className="text-gray-400">Total: </span>
          <span className="text-2xl font-bold text-yellow-400">{cartas.length}</span>
          <span className="text-gray-400"> cartas</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cartas por nombre..."
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-yellow-500 rounded-lg text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((categoryKey) => (
          <button
            key={categoryKey}
            onClick={() => setSelectedCategory(categoryKey)}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              selectedCategory === categoryKey
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {categoryKey === 'todas' ? 'Todas' : getCategoryLabel(categoryKey)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredCartas.map((carta) => (
          <CartaComponent key={carta.id} carta={carta} onClick={() => setSelectedCarta(carta)} />
        ))}
      </div>

      {filteredCartas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-xl">No se encontraron cartas</p>
        </div>
      )}

      {selectedCarta && <CartaModal carta={selectedCarta} onClose={() => setSelectedCarta(null)} />}
    </div>
  );
}
