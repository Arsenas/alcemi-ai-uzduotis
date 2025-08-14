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
            // neleisk fokuso ant paspaudimo pradžios
            onMouseDown={(e) => e.preventDefault()}
            // fokusą uždėk po atleidimo (click), tada kviesk onPick
            onClick={(e) => {
              e.currentTarget.focus();
              onPick(label);
            }}
          >
            {label}
          </button>

          {i === 3 && <span className="chips-break" aria-hidden />}
        </Fragment>
      ))}
    </div>
  );
}
