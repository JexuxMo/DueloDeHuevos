/**
 * @typedef {'huevo_de_combate' | 'hechizo' | 'trampa' | 'encantamiento_debil' | 'encantamiento_fuerte'} CardCategoryKey
 */

/**
 * @typedef {Object} Card
 * @property {number} id
 * @property {string} serial
 * @property {CardCategoryKey | string} categoria
 * @property {string} nombre
 * @property {number | null} nivel
 * @property {string} clase
 * @property {string} tipo
 * @property {number | null} ataque
 * @property {number | null} defensa
 * @property {string} efecto
 * @property {string} ambientacion
 */

const CARD_CATEGORY_KEYS = new Set([
  'huevo_de_combate',
  'hechizo',
  'trampa',
  'encantamiento_debil',
  'encantamiento_fuerte',
]);
const CATEGORY_KEY_REGEX = /^[a-z0-9_]+$/;

const isNullableNumber = (value) => value === null || (typeof value === 'number' && Number.isFinite(value));

/**
 * @param {unknown} value
 * @returns {value is Card}
 */
export const isCard = (value) => {
  if (!value || typeof value !== 'object') return false;

  const card = /** @type {Record<string, unknown>} */ (value);

  return (
    typeof card.id === 'number' &&
    typeof card.serial === 'string' &&
    typeof card.categoria === 'string' &&
    CATEGORY_KEY_REGEX.test(card.categoria) &&
    typeof card.nombre === 'string' &&
    isNullableNumber(card.nivel) &&
    typeof card.clase === 'string' &&
    typeof card.tipo === 'string' &&
    isNullableNumber(card.ataque) &&
    isNullableNumber(card.defensa) &&
    typeof card.efecto === 'string' &&
    typeof card.ambientacion === 'string'
  );
};

/**
 * @param {unknown[]} payload
 * @returns {{ cards: Card[]; invalidCount: number }}
 */
export const parseCardsPayload = (payload) => {
  /** @type {Card[]} */
  const cards = [];
  let invalidCount = 0;

  for (const item of payload) {
    if (isCard(item)) {
      const normalized = {
        ...item,
        categoria: item.categoria.toLowerCase(),
      };

      if (!CARD_CATEGORY_KEYS.has(normalized.categoria)) {
        invalidCount += 1;
        continue;
      }

      cards.push(normalized);
    } else {
      invalidCount += 1;
    }
  }

  return { cards, invalidCount };
};
