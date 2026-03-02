import { useEffect, useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import DeckCardTile from '../components/DeckCardTile';
import { getCategoryLabel, isCombatEggCategory } from '../utils/cardCategory';
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

  const [decks, setDecks] = useState([createDeck(0)]);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [dropZone, setDropZone] = useState(null);

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

  const selectedDeck = useMemo(
    () => decks.find((deck) => deck.id === selectedDeckId) || null,
    [decks, selectedDeckId],
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCards = useMemo(
    () => cartas.filter((carta) => carta.nombre.toLowerCase().includes(normalizedSearch)),
    [cartas, normalizedSearch],
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

  const handleDropInZone = (targetZone) => (event) => {
    event.preventDefault();
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
    <div className="p-4 lg:p-5 max-w-[1400px] mx-auto overflow-x-hidden">
      <div className="mb-3 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-3">
        <div className="bg-gray-800 border border-yellow-500 px-4 py-2 rounded-xl">
          <h1 className="text-xl lg:text-2xl font-bold text-white">Constructor de Mazos</h1>
        </div>
        <div className="flex justify-start lg:justify-end">
          <button
            onClick={createNewDeck}
            className="bg-yellow-600 hover:bg-yellow-700 border border-yellow-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Mazo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-3 items-stretch">
        <div className="space-y-3 min-w-0 lg:sticky lg:top-3 lg:self-start">
          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-3 h-[210px] overflow-hidden">
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

          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-4 flex items-center justify-center h-[280px] overflow-hidden">
            <div className="w-[174px] aspect-[436/687] bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-yellow-500 rounded-lg p-3 text-center">
              <div className="text-5xl mb-2">🥚</div>
              <p className="text-sm font-bold text-gray-900 line-clamp-2">{selectedCard?.nombre || 'Sin carta seleccionada'}</p>
              <p className="text-xs text-gray-700 mt-1">{selectedCard?.serial || '---'}</p>
              <p className="text-xs text-gray-800 mt-2">{typeText}</p>
              <p className="text-xs text-gray-800">{levelText}</p>
              {isCombatEggCategory(selectedCard?.categoria) && (
                <div className="mt-2 text-xs font-bold text-gray-900">
                  ATK {selectedCard?.ataque ?? '-'} / DEF {selectedCard?.defensa ?? '-'}
                </div>
              )}
            </div>
          </section>

          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-3 h-[260px] overflow-hidden">
            <h3 className="text-sm font-bold text-yellow-400 mb-2">Texto de carta</h3>
            <div className="h-[180px] overflow-y-auto pr-1">
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

          <section className="bg-gray-800 border border-yellow-500 rounded-xl overflow-hidden">
            <div className="grid grid-cols-2">
              <button className="border-r border-gray-700 py-1.5 text-sm text-white bg-gray-700 hover:bg-gray-600">Guardar</button>
              <button className="py-1.5 text-sm text-white bg-gray-700 hover:bg-gray-600">Paso Atrás</button>
            </div>
            <div className="grid grid-cols-2">
              <button className="border-r border-gray-700 py-1.5 text-sm text-white bg-gray-700 hover:bg-gray-600">Eliminar</button>
              <button className="py-1.5 text-sm text-white bg-gray-700 hover:bg-gray-600">Limpiar</button>
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-3">
          <section className="bg-gray-800 border border-yellow-500 rounded-xl p-3 overflow-hidden h-[210px]">
            <div className="flex gap-2 mb-3">
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
              <button className="bg-yellow-600 hover:bg-yellow-700 border border-yellow-500 px-3 py-1.5 rounded-lg font-bold text-sm text-white">Buscar</button>
            </div>

            {loading && <p className="text-gray-300 text-sm">Cargando cartas...</p>}
            {!loading && error && <p className="text-red-300 text-sm">{error}</p>}

            <div className="h-[140px] overflow-hidden">
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
                        onDragEnd={clearDropZone}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!loading && !error && filteredCards.length === 0 && (
                <p className="text-gray-400 text-sm">No se encontraron cartas con ese nombre.</p>
              )}
            </div>
          </section>

          <section
            onDragOver={handleZoneDragOver('main')}
            onDrop={handleDropInZone('main')}
            onDragLeave={clearDropZone}
            className={`bg-gray-800 border rounded-xl p-3 overflow-hidden h-[430px] transition-colors ${
              dropZone === 'main' ? 'border-green-400 bg-gray-700/80' : 'border-yellow-500'
            }`}
          >
            <div className="h-[370px] overflow-y-auto pr-1">
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
                    onDragEnd={clearDropZone}
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
            className={`border rounded-xl p-3 h-[190px] overflow-hidden transition-colors ${
              dropZone === 'reserve' ? 'border-green-400 bg-gray-700/80' : 'bg-gray-800 border-yellow-500'
            }`}
          >
            <div className="mb-2 text-gray-300 text-sm">
              Librería de reserva: {reserveDeckCards.length}/{RESERVE_DECK_LIMIT}
            </div>
            <div className="w-full overflow-x-auto h-[150px]">
              <div className="flex gap-2 min-w-max">
                {reserveDeckCards.map((card) => (
                  <DeckCardTile
                    key={card.deckEntryId}
                    card={card}
                    onClick={() => setSelectedCard(card)}
                    onDragStart={beginDragFromDeck(card, 'reserve')}
                    onDragEnd={clearDropZone}
                  />
                ))}
              </div>
            </div>

            {reserveDeckCards.length === 0 && (
              <p className="text-gray-400 text-sm mt-2">Librería de reserva vacía. Suelta cartas aquí para reservarlas.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
