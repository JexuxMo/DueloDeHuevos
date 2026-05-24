const imageModules = import.meta.glob('../assets/serie1/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const toSlug = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const imageMap = Object.entries(imageModules).reduce((acc, [path, src]) => {
  const fileName = path.split('/').pop() || '';
  const baseName = fileName.replace(/\.[^.]+$/, '');
  acc[toSlug(baseName)] = src;
  return acc;
}, {});

export const getCardImageBySerial = (cardSerial) => imageMap[toSlug(cardSerial)];
