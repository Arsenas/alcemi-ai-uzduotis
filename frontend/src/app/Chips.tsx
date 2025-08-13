type Props = { items: string[]; onPick: (val: string) => void };

export default function Chips({ items, onPick }: Props) {
  return (
    <div className="chips-row" role="list">
      {items.map((label) => (
        <button key={label} className="chip" role="listitem" type="button" onClick={() => onPick(label)}>
          {label}
        </button>
      ))}
    </div>
  );
}
