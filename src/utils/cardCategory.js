export const CATEGORY_LABELS = {
  huevo_de_combate: 'Huevo de combate',
  hechizo: 'Hechizo',
  trampa: 'Trampa',
  encantamiento_debil: 'Encantamiento Débil',
  encantamiento_fuerte: 'Encantamiento Fuerte',
};

export const CATEGORY_ORDER = [
  'huevo_de_combate',
  'hechizo',
  'trampa',
  'encantamiento_debil',
  'encantamiento_fuerte',
];

export const getCategoryLabel = (categoryKey) => CATEGORY_LABELS[categoryKey] || categoryKey;

export const isCombatEggCategory = (categoryKey) => categoryKey === 'huevo_de_combate';
