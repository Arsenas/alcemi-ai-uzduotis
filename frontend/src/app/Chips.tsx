import { useEffect, useRef, useState } from "react";

type Props = { items: string[]; onPick: (val: string) => void };

export default function Chips({ items, onPick }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const downX = useRef(0);
  const scrollStart = useRef(0);

  // Click/tap OUTSIDE: grįžtam į default (no selected) ir nuimam fokusą nuo chip
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const w = wrapperRef.current;
      if (w && !w.contains(e.target as Node)) {
        setSelected(null);
        const ae = document.activeElement as HTMLElement | null;
        if (ae && ae.classList.contains("chip")) ae.blur();
      }
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="suggestions"
      role="list"
      onTouchStart={() => (drag.current = false)}
      onTouchMove={() => (drag.current = true)}
      onMouseDown={(e) => {
        const el = wrapperRef.current;
        if (!el) return;
        drag.current = false;
        downX.current = e.pageX;
        scrollStart.current = el.scrollLeft;
        el.classList.add("is-dragging");
      }}
      onMouseMove={(e) => {
        const el = wrapperRef.current;
        if (!el || !el.classList.contains("is-dragging")) return;
        const dx = e.pageX - downX.current;
        if (Math.abs(dx) > 3) drag.current = true;
        el.scrollLeft = scrollStart.current - dx;
        e.preventDefault();
      }}
      onMouseUp={() => wrapperRef.current?.classList.remove("is-dragging")}
      onMouseLeave={() => wrapperRef.current?.classList.remove("is-dragging")}
    >
      {items.map((label) => (
        <button
          key={label}
          className="chip"
          role="listitem"
          type="button"
          aria-pressed={selected === label}
          onClick={(e) => {
            if (drag.current) return; // buvo drag – neklikink
            setSelected(label); // paliekam "selected"
            onPick(label);
            (e.currentTarget as HTMLButtonElement).blur(); // nuimam focus, ring lieka per aria-pressed
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
