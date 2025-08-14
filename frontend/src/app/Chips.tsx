import { Fragment } from "react";

type Props = { items: string[]; onPick: (val: string) => void };

export default function Chips({ items, onPick }: Props) {
  return (
    <div className="suggestions" role="list">
      {items.map((label, i) => (
        <Fragment key={label}>
          <button
            className="chip"
            role="listitem"
            type="button"
            onClick={() => onPick(label)}
            onPointerDown={(e) => e.currentTarget.focus()} // <-- suteikia fokusą paspaudus
          >
            {label}
          </button>

          {i === 3 && <span className="chips-break" aria-hidden />}
        </Fragment>
      ))}
    </div>
  );
}
