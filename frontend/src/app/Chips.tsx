type Props = { items: string[]; onPick: (val: string) => void };

export default function Chips({ items, onPick }: Props) {
  return (
    <div className="suggestions" role="list">
      {items.map((label, i) => (
        <>
          <button key={label} className="chip" role="listitem" type="button" onClick={() => onPick(label)}>
            {label}
          </button>

          {/* įterpiam break po 4-o elemento */}
          {i === 3 && <span className="chips-break" aria-hidden />}
        </>
      ))}
    </div>
  );
}
