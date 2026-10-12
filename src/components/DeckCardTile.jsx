import CardFace from './CardFace';

export default function DeckCardTile({
  card,
  onClick,
  onDragStart,
  onDragEnd,
  compact = false,
  selected = false,
  draggable = true,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        ${compact ? 'w-[42px]' : 'w-[82px]'} aspect-[816/1287] flex-none shrink-0 overflow-hidden
        rounded-[5%] border-2 p-0 text-left transition-all hover:brightness-110
        ${selected ? 'border-yellow-300 ring-2 ring-yellow-400/70' : 'border-yellow-500'}
      `}
      title={card.nombre}
    >
      <CardFace card={card} className="h-full w-full" />
    </button>
  );
}
