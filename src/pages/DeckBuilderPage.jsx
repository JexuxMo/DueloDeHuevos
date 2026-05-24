import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import DeckCardTile from '../components/DeckCardTile';
import { CATEGORY_ORDER, getCategoryLabel, isCombatEggCategory } from '../utils/cardCategory';
import { parseCardsPayload } from '../types/card';

const MAIN_DECK_LIMIT = 30;
const RESERVE_DECK_LIMIT = 10;
const DRAG_CARD_MIME = 'application/x-deck-card';

const createDeck = (index) => ({
  id: Date.now() + index,
  name: `Mazo ${index + 1}`,
  mainCards: [],
  reserveCards: [],
});

const createDeckEntry = (card) => ({
  ...card,
  deckEntryId: `${card.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
});

const countTotalCopiesInDeck = (deck, cardId) => {
  const totalMain = deck.mainCards.filter((card) => card.id === cardId).length;
  const totalReserve = deck.reserveCards.filter((card) => card.id === cardId).length;
  return totalMain + totalReserve;
};

export default function DeckBuilderPage() {
  /** @type {[import('../types/card').Card[], Function]} */
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [combatClassFilter, setCombatClassFilter] = useState('all');
  const [combatTypeFilter, setCombatTypeFilter] = useState('all');
  const [combatLevelFilter, setCombatLevelFilter] = useState('all');
  const [combatAttackMinFilter, setCombatAttackMinFilter] = useState('');
  const [combatDefenseMinFilter, setCombatDefenseMinFilter] = useState('');

  const [decks, setDecks] = useState([createDeck(0)]);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [dropZone, setDropZone] = useState(null);
  const activeDragRef = useRef(null);
  const dropHandledRef = useRef(false);

  useEffect(() => {
    setSelectedDeckId((current) => current ?? decks[0]?.id ?? null);
  }, [decks]);

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

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId) || null,
    [decks, selectedDeckId],
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const isCombatCategorySelected = selectedCategory === 'huevo_de_combate';

  const combatCards = useMemo(
    () => cartas.filter((carta) => carta.categoria === 'huevo_de_combate'),
    [cartas],
  );

  const combatClassOptions = useMemo(
    () => [...new Set(combatCards.map((carta) => carta.clase).filter(Boolean))].sort(),
    [combatCards],
  );

  const combatTypeOptions = useMemo(
    () => [...new Set(combatCards.map((carta) => carta.tipo).filter((tipo) => tipo && tipo !== 'N/A'))].sort(),
    [combatCards],
  );

  const combatLevelOptions = useMemo(
    () =>
      [...new Set(combatCards.map((carta) => carta.nivel).filter((nivel) => typeof nivel === 'number'))].sort(
        (a, b) => a - b,
      ),
    [combatCards],
  );

  const filteredCards = useMemo(
    () =>
      cartas.filter((carta) => {
        const matchesSearch = carta.nombre.toLowerCase().includes(normalizedSearch);
        const matchesCategory = selectedCategory === 'all' || carta.categoria === selectedCategory;
        if (!matchesSearch || !matchesCategory) return false;
        if (!isCombatCategorySelected) return true;

        const matchesClass = combatClassFilter === 'all' || carta.clase === combatClassFilter;
        const matchesType = combatTypeFilter === 'all' || carta.tipo === combatTypeFilter;
        const matchesLevel =
          combatLevelFilter === 'all' || carta.nivel === Number.parseInt(combatLevelFilter, 10);

        const attackMin = Number.parseInt(combatAttackMinFilter, 10);
        const defenseMin = Number.parseInt(combatDefenseMinFilter, 10);
        const matchesAttack =
          Number.isNaN(attackMin) || (typeof carta.ataque === 'number' && carta.ataque >= attackMin);
        const matchesDefense =
          Number.isNaN(defenseMin) || (typeof carta.defensa === 'number' && carta.defensa >= defenseMin);

        return matchesClass && matchesType && matchesLevel && matchesAttack && matchesDefense;
      }),
    [
      cartas,
      normalizedSearch,
      selectedCategory,
      isCombatCategorySelected,
      combatClassFilter,
      combatTypeFilter,
      combatLevelFilter,
      combatAttackMinFilter,
      combatDefenseMinFilter,
    ],
  );

  const hasFilteredOverflow = filteredCards.length > 10;

  const createNewDeck = () => {
    setDecks((prev) => {
      const next = createDeck(prev.length);
      return [next, ...prev];
    });
  };

  const handleZoneDragOver = (zone) => (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (dropZone !== zone) setDropZone(zone);
  };

  const clearDropZone = () => setDropZone(null);

  const beginDragFromSearch = (card) => (event) => {
    activeDragRef.current = { source: 'search', card };
    dropHandledRef.current = false;
    event.dataTransfer.effectAllowed = 'copyMove';
    event.dataTransfer.setData(
      DRAG_CARD_MIME,
      JSON.stringify({
        source: 'search',
        card,
      }),
    );
    setSelectedCard(card);
  };

  const beginDragFromDeck = (card, sourceZone) => (event) => {
    activeDragRef.current = { source: sourceZone, card, deckEntryId: card.deckEntryId };
    dropHandledRef.current = false;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      DRAG_CARD_MIME,
      JSON.stringify({
        source: sourceZone,
        deckEntryId: card.deckEntryId,
        card,
      }),
    );
    setSelectedCard(card);
  };

  const handleDeckDragEnd = (sourceZone, deckEntryId) => () => {
    const wasHandled = dropHandledRef.current;

    dropHandledRef.current = false;
    activeDragRef.current = null;
    clearDropZone();

    if (wasHandled || !selectedDeckId) return;

    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== selectedDeckId) return deck;

        if (sourceZone === 'reserve') {
          return {
            ...deck,
            reserveCards: deck.reserveCards.filter((card) => card.deckEntryId !== deckEntryId),
          };
        }

        return {
          ...deck,
          mainCards: deck.mainCards.filter((card) => card.deckEntryId !== deckEntryId),
        };
      }),
    );
  };

  const handleDropInZone = (targetZone) => (event) => {
    event.preventDefault();
    dropHandledRef.current = true;
    clearDropZone();

    if (!selectedDeckId) return;

    const raw = event.dataTransfer.getData(DRAG_CARD_MIME);
    if (!raw) return;

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }

    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== selectedDeckId) return deck;

        if (payload.source === 'search') {
          if (targetZone === 'main' && deck.mainCards.length >= MAIN_DECK_LIMIT) return deck;
          if (targetZone === 'reserve' && deck.reserveCards.length >= RESERVE_DECK_LIMIT) return deck;
          if (countTotalCopiesInDeck(deck, payload.card.id) >= 3) return deck;

          const entry = createDeckEntry(payload.card);
          if (targetZone === 'main') {
            return { ...deck, mainCards: [...deck.mainCards, entry] };
          }
          return { ...deck, reserveCards: [...deck.reserveCards, entry] };
        }

        if (payload.source !== 'main' && payload.source !== 'reserve') return deck;
        if (payload.source === targetZone) return deck;

        const sourceCards = payload.source === 'main' ? deck.mainCards : deck.reserveCards;
        const destinationCards = targetZone === 'main' ? deck.mainCards : deck.reserveCards;

        const sourceIndex = sourceCards.findIndex((card) => card.deckEntryId === payload.deckEntryId);
        if (sourceIndex === -1) return deck;
        if (targetZone === 'main' && destinationCards.length >= MAIN_DECK_LIMIT) return deck;
        if (targetZone === 'reserve' && destinationCards.length >= RESERVE_DECK_LIMIT) return deck;

        const movingCard = sourceCards[sourceIndex];
        const nextSourceCards = sourceCards.filter((card) => card.deckEntryId !== payload.deckEntryId);

        if (payload.source === 'main') {
          return {
            ...deck,
            mainCards: nextSourceCards,
            reserveCards: [...deck.reserveCards, movingCard],
          };
        }

        return {
          ...deck,
          reserveCards: nextSourceCards,
          mainCards: [...deck.mainCards, movingCard],
        };
      }),
    );

    if (payload?.card) setSelectedCard(payload.card);
  };

  const levelText = selectedCard?.nivel ? `Nivel ${selectedCard.nivel}` : 'Sin nivel';
  const typeText = selectedCard
    ? selectedCard.tipo !== 'N/A'
      ? selectedCard.tipo
      : getCategoryLabel(selectedCard.categoria)
    : 'Sin tipo';

  const mainDeckCards = selectedDeck?.mainCards ?? [];
  const reserveDeckCards = selectedDeck?.reserveCards ?? [];

  return (
    <div className="p-6 max-w-[1400px] mx-auto overflow-x-hidden lg:h-[calc(100dvh-4.5rem)] lg:overflow-hidden overscroll-none">
      <div className="h-full grid grid-rows-[auto_minmax(0,1fr)] gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Constructor de Mazos</h1>
        </div>
        <div className="flex justify-start lg:justify-end">
          <button
            onClick={createNewDeck}
            className="bg-yellow-600 hover:bg-yellow-700 border border-yellow-500 text-white h-8 px-3 rounded-lg font-bold inline-flex items-center gap-1.5 text-sm leading-none"
          >
            <Plus className="w-3.5 h-3.5" />
            Nuevo Mazo
          </button>
        </div>
      </div>

      <div className="min-h-0 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-3 items-stretch">
        <div className="min-w-0 min-h-0 lg:h-full pr-1 grid grid-rows-[170px_260px_minmax(0,1fr)_84px] xl:grid-rows-[190px_300px_minmax(0,1fr)_90px] gap-3">
          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-3 h-full overflow-hidden">
            <div className="space-y-2">
              {decks.map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => setSelectedDeckId(deck.id)}
                  className={`w-full border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    selectedDeckId === deck.id
                      ? 'bg-yellow-600 text-white border-yellow-400'
                      : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
                  }`}
                >
                  {deck.name}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-4 flex items-center justify-center h-full overflow-hidden">
            <div className="w-[184px] aspect-[436/687] bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-yellow-500 rounded-lg p-4 text-center">
              <div className="text-6xl mb-2">🥚</div>
              <p className="text-base font-bold text-gray-900 line-clamp-2">{selectedCard?.nombre || 'Sin carta seleccionada'}</p>
              <p className="text-sm text-gray-700 mt-1">{selectedCard?.serial || '---'}</p>
              <p className="text-sm text-gray-800 mt-2">{typeText}</p>
              <p className="text-sm text-gray-800">{levelText}</p>
              {isCombatEggCategory(selectedCard?.categoria) && (
                <div className="mt-2 text-sm font-bold text-gray-900">
                  ATK {selectedCard?.ataque ?? '-'} / DEF {selectedCard?.defensa ?? '-'}
                </div>
              )}
            </div>
          </section>

          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-4 h-full overflow-hidden">
            <h3 className="text-sm font-bold text-yellow-400 mb-2">Texto de carta</h3>
            <div className="h-[calc(100%-1.75rem)] overflow-y-auto overscroll-contain pr-1">
              {selectedCard?.efecto && (
                <p className="text-xs text-gray-200 leading-relaxed mb-2">
                  <span className="font-bold text-yellow-300">Efecto: </span>
                  {selectedCard.efecto}
                </p>
              )}
              {selectedCard?.ambientacion && (
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  <span className="font-bold not-italic text-yellow-300">Ambientación: </span>
                  {selectedCard.ambientacion}
                </p>
              )}
              {!selectedCard?.efecto && !selectedCard?.ambientacion && (
                <p className="text-xs text-gray-400">Esta carta no tiene texto de efecto o ambientación.</p>
              )}
            </div>
          </section>

          <section className="bg-gray-800 border border-yellow-500 rounded-xl h-full overflow-hidden">
            <div className="grid grid-cols-2 h-1/2">
              <button className="border-r border-gray-700 text-sm text-white bg-gray-700 hover:bg-gray-600">Guardar</button>
              <button className="text-sm text-white bg-gray-700 hover:bg-gray-600">Paso Atrás</button>
            </div>
            <div className="grid grid-cols-2 h-1/2 border-t border-gray-700">
              <button className="border-r border-gray-700 text-sm text-white bg-gray-700 hover:bg-gray-600">Eliminar</button>
              <button className="text-sm text-white bg-gray-700 hover:bg-gray-600">Limpiar</button>
            </div>
          </section>
        </div>

        <div className="min-w-0 min-h-0 lg:h-full grid grid-rows-[165px_minmax(0,1fr)_170px] xl:grid-rows-[185px_minmax(0,1fr)_190px] 2xl:grid-rows-[195px_minmax(0,1fr)_210px] gap-3">
          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-3 overflow-hidden h-full flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)] gap-3 h-full">
              <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-2 min-h-0 overflow-y-auto overscroll-contain">
                <p className="text-[11px] font-bold uppercase tracking-wide text-yellow-300 mb-2">Categoria</p>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-2 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-yellow-600 text-white border-yellow-400'
                        : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    Todas
                  </button>
                  {CATEGORY_ORDER.map((categoryKey) => (
                    <button
                      key={categoryKey}
                      type="button"
                      onClick={() => setSelectedCategory(categoryKey)}
                      className={`w-full text-left px-2 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        selectedCategory === categoryKey
                          ? 'bg-yellow-600 text-white border-yellow-400'
                          : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      {getCategoryLabel(categoryKey)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-w-0 min-h-0 flex flex-col">
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar cartas por nombre..."
                      className="w-full pl-9 pr-3 py-1.5 bg-gray-900 border border-yellow-500 rounded-lg text-white placeholder:text-gray-400"
                    />
                  </div>
                  <button className="bg-yellow-600 hover:bg-yellow-700 border border-yellow-500 h-8 px-3 rounded-lg font-bold inline-flex items-center leading-none text-sm text-white">Buscar</button>
                </div>

                <div className={`mb-2 grid grid-cols-2 xl:grid-cols-5 gap-2 ${!isCombatCategorySelected ? 'opacity-60' : ''}`}>
                  <select
                    value={combatClassFilter}
                    onChange={(event) => setCombatClassFilter(event.target.value)}
                    disabled={!isCombatCategorySelected}
                    className="w-full px-2 py-1.5 bg-gray-900 border border-yellow-500 rounded-lg text-white text-xs disabled:cursor-not-allowed"
                  >
                    <option value="all">Clase: Todas</option>
                    {combatClassOptions.map((className) => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>

                  <select
                    value={combatTypeFilter}
                    onChange={(event) => setCombatTypeFilter(event.target.value)}
                    disabled={!isCombatCategorySelected}
                    className="w-full px-2 py-1.5 bg-gray-900 border border-yellow-500 rounded-lg text-white text-xs disabled:cursor-not-allowed"
                  >
                    <option value="all">Tipo: Todos</option>
                    {combatTypeOptions.map((typeName) => (
                      <option key={typeName} value={typeName}>
                        {typeName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={combatLevelFilter}
                    onChange={(event) => setCombatLevelFilter(event.target.value)}
                    disabled={!isCombatCategorySelected}
                    className="w-full px-2 py-1.5 bg-gray-900 border border-yellow-500 rounded-lg text-white text-xs disabled:cursor-not-allowed"
                  >
                    <option value="all">Nivel: Todos</option>
                    {combatLevelOptions.map((levelValue) => (
                      <option key={levelValue} value={levelValue}>
                        Nivel {levelValue}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="0"
                    value={combatAttackMinFilter}
                    onChange={(event) => setCombatAttackMinFilter(event.target.value)}
                    disabled={!isCombatCategorySelected}
                    placeholder="ATK min"
                    className="w-full px-2 py-1.5 bg-gray-900 border border-yellow-500 rounded-lg text-white text-xs placeholder:text-gray-400 disabled:cursor-not-allowed"
                  />

                  <input
                    type="number"
                    min="0"
                    value={combatDefenseMinFilter}
                    onChange={(event) => setCombatDefenseMinFilter(event.target.value)}
                    disabled={!isCombatCategorySelected}
                    placeholder="DEF min"
                    className="w-full px-2 py-1.5 bg-gray-900 border border-yellow-500 rounded-lg text-white text-xs placeholder:text-gray-400 disabled:cursor-not-allowed"
                  />
                </div>

                {loading && <p className="text-gray-300 text-sm">Cargando cartas...</p>}
                {!loading && error && <p className="text-red-300 text-sm">{error}</p>}

                <div className="h-[95px] xl:h-auto xl:flex-1 min-h-0 overflow-hidden">
                  {!loading && !error && filteredCards.length > 0 && (
                    <div className={hasFilteredOverflow ? 'w-full overflow-x-auto pb-2' : ''}>
                      <div
                        className={!hasFilteredOverflow ? 'grid grid-cols-2 md:grid-cols-5 xl:grid-cols-10 gap-2 justify-items-center content-start' : ''}
                        style={
                          hasFilteredOverflow
                            ? {
                                display: 'grid',
                                gridAutoFlow: 'column',
                                gridAutoColumns: '6rem',
                                gap: '0.5rem',
                                minWidth: 'max-content',
                              }
                            : undefined
                        }
                      >
                        {filteredCards.map((card) => (
                          <DeckCardTile
                            key={`search-${card.id}`}
                            card={card}
                            onClick={() => setSelectedCard(card)}
                            onDragStart={beginDragFromSearch(card)}
                            onDragEnd={() => {
                              activeDragRef.current = null;
                              dropHandledRef.current = false;
                              clearDropZone();
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {!loading && !error && filteredCards.length === 0 && (
                    <p className="text-gray-400 text-sm">No se encontraron cartas con ese nombre.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section
            onDragOver={handleZoneDragOver('main')}
            onDrop={handleDropInZone('main')}
            onDragLeave={clearDropZone}
            className={`bg-gray-800 border rounded-xl p-3 overflow-hidden h-full transition-colors ${
              dropZone === 'main' ? 'border-green-400 bg-gray-700/80' : 'border-yellow-500'
            }`}
          >
            <div className="h-full overflow-y-auto overscroll-contain pr-1">
              {selectedDeck && (
                <p className="text-gray-300 text-sm mb-3">
                  Mazo principal: {mainDeckCards.length}/{MAIN_DECK_LIMIT}
                </p>
              )}

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 xl:grid-cols-10 gap-2 content-start">
                {mainDeckCards.map((card) => (
                  <DeckCardTile
                    key={card.deckEntryId}
                    card={card}
                    onClick={() => setSelectedCard(card)}
                    onDragStart={beginDragFromDeck(card, 'main')}
                    onDragEnd={handleDeckDragEnd('main', card.deckEntryId)}
                    selected={selectedCard?.deckEntryId === card.deckEntryId}
                  />
                ))}
              </div>

              {selectedDeck && mainDeckCards.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">
                  Mazo principal vacío. Arrastra cartas desde la búsqueda o desde la reserva.
                </p>
              )}
            </div>
          </section>

          <section
            onDragOver={handleZoneDragOver('reserve')}
            onDrop={handleDropInZone('reserve')}
            onDragLeave={clearDropZone}
            className={`border rounded-xl p-3 h-full overflow-hidden transition-colors ${
              dropZone === 'reserve' ? 'border-green-400 bg-gray-700/80' : 'bg-gray-800 border-yellow-500'
            }`}
          >
            <div className="mb-2 text-gray-300 text-sm">
              Librería de reserva: {reserveDeckCards.length}/{RESERVE_DECK_LIMIT}
            </div>
            <div className="w-full overflow-x-auto h-[95px] xl:h-[120px] 2xl:h-[150px]">
              <div className="flex gap-2 min-w-max">
                {reserveDeckCards.map((card) => (
                  <DeckCardTile
                    key={card.deckEntryId}
                    card={card}
                    onClick={() => setSelectedCard(card)}
                    onDragStart={beginDragFromDeck(card, 'reserve')}
                    onDragEnd={handleDeckDragEnd('reserve', card.deckEntryId)}
                  />
                ))}
              </div>
              {reserveDeckCards.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">Librería de reserva vacía. Suelta cartas aquí para reservarlas.</p>
              )}
            </div>
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}
