import { getCategoryLabel, isCombatEggCategory } from '../utils/cardCategory';

export default function DeckCardTile({
  card,
  onClick,
  onDragStart,
  onDragEnd,
  compact = false,
  selected = false,
  draggable = true,
}) {
  const cardType = card.tipo !== 'N/A' ? card.tipo : getCategoryLabel(card.categoria);

  return (
    <button
      type="button"
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        ${compact ? 'w-[62px]' : 'w-[87px]'} aspect-[436/687] flex-none shrink-0
        rounded-lg border-2 p-1 text-left
        transition-all hover:brightness-110
        bg-gradient-to-br from-yellow-100 to-orange-200
        ${selected ? 'border-yellow-300 ring-2 ring-yellow-400/70' : 'border-yellow-500'}
      `}
      title={card.nombre}
    >
      <div className="text-[10px] font-bold text-gray-900 leading-tight line-clamp-2">{card.nombre}</div>
      <div className="text-[9px] text-gray-700 mt-1 line-clamp-1">{cardType}</div>
      {!compact && (
        <>
          <div className="text-[9px] text-gray-700 mt-1">{card.serial}</div>
          {isCombatEggCategory(card.categoria) && (
            <div className="text-[9px] font-bold text-gray-900 mt-1">ATK {card.ataque ?? '-'} / DEF {card.defensa ?? '-'}</div>
          )}
        </>
      )}
    </button>
  );
}
