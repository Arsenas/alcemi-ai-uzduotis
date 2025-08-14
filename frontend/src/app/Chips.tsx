import { useEffect, useRef, useState } from "react";

type Props = { items: string[]; onPick: (val: string) => void };

export default function Chips({ items, onPick }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // drag / scroll kontrolė
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  // Už ribų paspaudus – nuimam `selected` ir fokusą nuo chip
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const w = wrapRef.current;
      if (w && !w.contains(e.target as Node)) {
        setSelected(null);
        const ae = document.activeElement as HTMLElement | null;
        if (ae?.classList.contains("chip")) ae.blur();
      }
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="suggestions"
      role="list"
      tabIndex={0} // kad gautų fokusą ir veiktų rodyklės
      onKeyDown={(e) => {
        const el = wrapRef.current;
        if (!el) return;
        if (e.key === "ArrowRight") {
          el.scrollBy({ left: 96, behavior: "smooth" });
          e.preventDefault();
        } else if (e.key === "ArrowLeft") {
          el.scrollBy({ left: -96, behavior: "smooth" });
          e.preventDefault();
        } else if (e.key === "Home") {
          el.scrollTo({ left: 0, behavior: "smooth" });
          e.preventDefault();
        } else if (e.key === "End") {
          el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
          e.preventDefault();
        }
      }}
      onPointerDown={(e) => {
        const el = wrapRef.current;
        if (!el) return;
        dragging.current = false;
        startX.current = e.clientX;
        startScroll.current = el.scrollLeft;
        // laikom pointer capture, kad drag nenutrūktų palikus elementą
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        el.classList.add("is-dragging");
      }}
      onPointerMove={(e) => {
        const el = wrapRef.current;
        if (!el || !el.classList.contains("is-dragging")) return;
        const dx = e.clientX - startX.current;
        if (Math.abs(dx) > 3) dragging.current = true;
        el.scrollLeft = startScroll.current - dx;
        e.preventDefault(); // svarbu touch’uose
      }}
      onPointerUp={(e) => {
        const el = wrapRef.current;
        el?.classList.remove("is-dragging");
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
        // mažas delay, kad click handleris matytų galutinę dragging būseną
        requestAnimationFrame(() => (dragging.current = false));
      }}
      onPointerCancel={(e) => {
        const el = wrapRef.current;
        el?.classList.remove("is-dragging");
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
        dragging.current = false;
      }}
    >
      {items.map((label) => (
        <button
          key={label}
          className="chip"
          role="listitem"
          type="button"
          aria-pressed={selected === label}
          onClick={(e) => {
            if (dragging.current) return; // jei buvo drag, kliką ignoruojam
            setSelected(label); // pažymim
            onPick(label);
            (e.currentTarget as HTMLButtonElement).blur(); // focus nuimam, ring lieka per aria-pressed
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
