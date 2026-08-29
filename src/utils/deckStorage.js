
const STORAGE_KEY_PREFIX = 'dueloDeHuevos:decks:';

export const getDecksStorageKey = (userId) => {
  if (!userId) return null;
  return `${STORAGE_KEY_PREFIX}${userId}`;
};

export const loadDecks = (userId) => {
  const key = getDecksStorageKey(userId);
  if (!key) return null;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return null;

    return parsed.map((deck) => ({
      id: deck.id,
      name: typeof deck.name === 'string' ? deck.name.trim() : `Mazo ${deck.id}`,
      mainCards: Array.isArray(deck.mainCards) ? deck.mainCards : [],
      reserveCards: Array.isArray(deck.reserveCards) ? deck.reserveCards : [],
    }));
  } catch {
    return null;
  }
};

export const saveDecks = (userId, decks) => {
  const key = getDecksStorageKey(userId);
  if (!key) return { success: false, error: 'Usuario no autenticado' };

  try {
    const decksToSave = decks.map((deck) => ({
      id: deck.id,
      name: typeof deck.name === 'string' ? deck.name.trim() : `Mazo ${deck.id}`,
      mainCards: Array.isArray(deck.mainCards) ? deck.mainCards : [],
      reserveCards: Array.isArray(deck.reserveCards) ? deck.reserveCards : [],
    }));

    localStorage.setItem(key, JSON.stringify(decksToSave));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Error al guardar en localStorage' };
  }
};

export const saveSingleDeck = (userId, deck, allDecks) => {
  const key = getDecksStorageKey(userId);
  if (!key) return { success: false, error: 'Usuario no autenticado' };

  try {
    const existingIndex = allDecks.findIndex((d) => d.id === deck.id);
    const updatedDecks = existingIndex >= 0
      ? allDecks.map((d, i) => (i === existingIndex ? deck : d))
      : [...allDecks, deck];

    localStorage.setItem(key, JSON.stringify(updatedDecks));
    return { success: true, decks: updatedDecks };
  } catch (error) {
    return { success: false, error: error.message || 'Error al guardar el mazo' };
  }
};

export const deleteDeckFromStorage = (userId, deckId, allDecks) => {
  const key = getDecksStorageKey(userId);
  if (!key) return { success: false, error: 'Usuario no autenticado' };

  try {
    const updatedDecks = allDecks.filter((d) => d.id !== deckId);
    localStorage.setItem(key, JSON.stringify(updatedDecks));
    return { success: true, decks: updatedDecks };
  } catch (error) {
    return { success: false, error: error.message || 'Error al eliminar el mazo' };
  }
};