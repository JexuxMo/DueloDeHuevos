import { getCategoryLabel, isCombatEggCategory } from '../utils/cardCategory';

const artModules = import.meta.glob('../assets/serie1/arts/*.png', {
  eager: true,
  import: 'default',
});

const templateModules = import.meta.glob('../assets/templates/*.png', {
  eager: true,
  import: 'default',
});

const rankModules = import.meta.glob('../assets/icons/rank*.png', {
  eager: true,
  import: 'default',
});

const artBySerial = Object.entries(artModules).reduce((artMap, [path, source]) => {
  const serial = path.split('/').pop()?.replace(/\.png$/, '');
  if (serial) artMap[serial] = source;
  return artMap;
}, {});

const templateByName = Object.entries(templateModules).reduce((templateMap, [path, source]) => {
  const name = path.split('/').pop()?.replace(/\.png$/, '');
  if (name) templateMap[name] = source;
  return templateMap;
}, {});

const rankByLevel = Object.entries(rankModules).reduce((rankMap, [path, source]) => {
  const level = Number(path.match(/rank(\d+)\.png$/)?.[1]);
  if (Number.isInteger(level) && level > 0) rankMap[level] = source;
  return rankMap;
}, {});

const combatTemplateByClass = {
  Clara: 'clara',
  Yema: 'yema',
  Cascarón: 'cascaron',
  Podrido: 'podrido',
};

const templateByCategory = {
  hechizo: 'hechizo',
  trampa: 'trampa',
  encantamiento_fuerte: 'e_fuerte',
  encantamiento_debil: 'e_debil',
};

const getCardArtBySerial = (serial) => artBySerial[serial];

const getCardTemplate = (card) => {
  const templateName = isCombatEggCategory(card?.categoria)
    ? combatTemplateByClass[card?.clase]
    : templateByCategory[card?.categoria];

  return templateByName[templateName] || templateByName.clara;
};

export default function CardFace({ card, className = '' }) {
  if (!card) {
    return <div className={`aspect-[816/1287] bg-gray-200 ${className}`} aria-label="Sin carta seleccionada" />;
  }

  const isCombatEgg = isCombatEggCategory(card.categoria);
  const cardArt = getCardArtBySerial(card.serial);
  const cardTemplate = getCardTemplate(card);
  const rankImage = rankByLevel[card.nivel];
  const detailText = [card.efecto, card.ambientacion].filter(Boolean);

  return (
    <div
      className={`relative aspect-[816/1287] overflow-hidden [container-type:inline-size] ${className}`}
      aria-label={`${card.nombre}, ${card.serial}`}
    >
      <div className="absolute left-[7.2%] top-[17.4%] h-[37.6%] w-[85.6%] overflow-hidden bg-gray-100">
        {cardArt ? (
          <img src={cardArt} alt="" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="flex h-full items-center justify-center text-[12cqw]">🥚</div>
        )}
      </div>

      <img src={cardTemplate} alt="" className="pointer-events-none absolute inset-0 z-10 h-full w-full" draggable={false} />

      <div className="pointer-events-none absolute inset-0 z-20 font-sans text-back">
        <p className="absolute left-[5%] top-[11.5%] w-[65%] text-center text-[6.1cqw] leading-none line-clamp-2 font-bold text-white">
          {card.nombre}
        </p>

        <div className="absolute left-[13%] top-[57.5%] items-center justify-between gap-[2%] text-[8cqw] font-bold leading-none text-white">
          <span className="max-w-[57%] truncate">{isCombatEgg ? card.tipo : getCategoryLabel(card.categoria)}</span>
        </div>

        <div className="absolute left-[10%] top-[3%] items-center justify-between gap-[2%] text-[5cqw] font-bold leading-none">
          {isCombatEgg && rankImage ? (
            <img src={rankImage} alt={`Rango ${card.nivel}`} className="h-[10cqw] w-auto object-contain" draggable={false} />
          ) : null}
        </div>

        {isCombatEgg && (
          <div className="absolute left-[35%] top-[89%] flex w-[50%] justify-between text-[4.5cqw] font-black leading-none text-black">
            <span>ATK {card.ataque ?? '-'}</span>
            <span>DEF {card.defensa ?? '-'}</span>
          </div>
        )}

        <div className={`absolute left-[10%] w-[78%] top-[67%] font-bold text-center text-[3.5cqw] leading-[1.12] ${isCombatEgg ? 'top-[61.2%] h-[27.5%]' : 'top-[58.5%] h-[30.2%]'}`}>
          {detailText.map((text, index) => (
            <p key={index} className={index === 1 ? 'mt-[4%] italic' : ''}>
              {text}
            </p>
          ))}
        </div>

        <p className="absolute bottom-[4%] right-[50%] text-[2.7cqw] font-bold leading-none text-white">{card.serial}</p>
      </div>
    </div>
  );
}
