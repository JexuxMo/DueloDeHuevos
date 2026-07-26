import { useEffect, useMemo, useState } from 'react';
import { GalleryHorizontal, Search, Sparkles } from 'lucide-react';
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
  const [selectedSeries, setSelectedSeries] = useState('todas');
  const [selectedCarta, setSelectedCarta] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/cardsS1.json?t=${Date.now()}`)
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

  const seriesButtons = ['todas', 'Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5'];

  const getSerieValue = (series) => {
    const map = { 'Serie 1': 's1', 'Serie 2': 's2', 'Serie 3': 's3', 'Serie 4': 's4', 'Serie 5': 's5' };
    return map[series] || null;
  };

  const filteredCartas = cartas.filter((carta) => {
    const matchesSearch = carta.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || carta.categoria === selectedCategory;
    const serieVal = getSerieValue(selectedSeries);
    const matchesSeries = selectedSeries === 'todas' || carta.serie === serieVal;
    return matchesSearch && matchesCategory && matchesSeries;
  });

  if (loading) {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/40 px-6 py-16 text-center text-white shadow-2xl backdrop-blur">
          <p className="text-lg font-semibold tracking-[0.3em] uppercase text-yellow-300/80">Duelo de Huevos</p>
          <p className="mt-4 text-2xl font-black sm:text-4xl">Cargando galería...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-red-300/30 bg-red-950/40 px-6 py-16 text-center text-white shadow-2xl backdrop-blur">
          <p className="text-2xl font-black text-red-200">No pudimos cargar la galería</p>
          <p className="mt-3 text-base text-red-100/80">{error}</p>
        </div>
      </div>
    );
  }

  const totalCartas = cartas.length;
  const totalFiltradas = filteredCartas.length;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl backdrop-blur sm:p-8">
        <div className="flex flex-col gap-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div className="space-y-5 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-yellow-200">
                <Sparkles className="h-4 w-4" />
                Galería pública
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Duelo de Huevos</h1>
                <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                  Explora la colección de cartas, filtra por categoría y abre cada carta para verla en detalle.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Cartas visibles</p>
                  <p className="mt-1 text-2xl font-black text-yellow-300">{totalFiltradas}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Total serie 1</p>
                  <p className="mt-1 text-2xl font-black text-yellow-300">{totalCartas}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-200/20 to-white/5 p-5 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-yellow-300/15 p-3 text-yellow-200">
                  <GalleryHorizontal className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Vista de galería</p>
                  <p className="text-lg font-bold">Solo lectura</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cartas por nombre..."
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none ring-0 transition focus:border-yellow-300/50 focus:bg-slate-950/80"
              />
            </div>

            <div className="flex flex-wrap gap-2 xl:justify-end">
              {categories.map((categoryKey) => (
                <button
                  key={categoryKey}
                  onClick={() => setSelectedCategory(categoryKey)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    selectedCategory === categoryKey
                      ? 'bg-yellow-300 text-slate-950 shadow-lg shadow-yellow-500/20'
                      : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {categoryKey === 'todas' ? 'Todas' : getCategoryLabel(categoryKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {seriesButtons.map((series) => {
              const isUnavailable = ['Serie 2', 'Serie 3', 'Serie 4', 'Serie 5'].includes(series);
              return (
                <button
                  key={series}
                  type="button"
                  className={`relative rounded-full px-4 py-2 text-sm font-bold transition ${
                    isUnavailable
                      ? 'cursor-not-allowed border border-dashed border-white/15 bg-white/5 text-slate-400'
                      : selectedSeries === series
                        ? 'bg-yellow-300 text-slate-950 shadow-lg shadow-yellow-500/20'
                        : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                  onClick={() => {
                    if (!isUnavailable) {
                      setSelectedSeries(series);
                    }
                  }}
                >
                  {series === 'todas' ? 'Todas' : series}
                  {isUnavailable && (
                    <span className="absolute -top-3 -right-2 whitespace-nowrap rounded-full border border-yellow-300/40 bg-slate-950 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-yellow-300">
                      Próximamente
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-7xl">
        {filteredCartas.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {filteredCartas.map((carta) => (
              <CartaComponent key={carta.id} carta={carta} onClick={() => setSelectedCarta(carta)} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/35 px-6 py-16 text-center text-white backdrop-blur">
            <p className="text-2xl font-black">No se encontraron cartas</p>
            <p className="mt-2 text-sm text-slate-300">Prueba con otro nombre o cambia la categoría.</p>
          </div>
        )}
      </section>

      {selectedCarta && <CartaModal carta={selectedCarta} onClose={() => setSelectedCarta(null)} />}
    </div>
  );
}
