import { useEffect, useRef } from "react";

type Props = { items: string[]; onPick: (val: string) => void };

export default function Chips({ items, onPick }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // drag / scroll
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  // Paspaudus už ribų – numetam focus (grįžta į default)
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const w = wrapRef.current;
      if (w && !w.contains(e.target as Node)) {
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
      tabIndex={0}
      onKeyDown={(e) => {
        const el = wrapRef.current;
        if (!el) return;
        if (e.key === "ArrowRight") {
          el.scrollBy({ left: 96, behavior: "smooth" });
          e.preventDefault();
        }
        if (e.key === "ArrowLeft") {
          el.scrollBy({ left: -96, behavior: "smooth" });
          e.preventDefault();
        }
      }}
      onPointerDown={(e) => {
        const el = wrapRef.current;
        if (!el) return;
        dragging.current = false;
        startX.current = e.clientX;
        startScroll.current = el.scrollLeft;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        el.classList.add("is-dragging");
      }}
      onPointerMove={(e) => {
        const el = wrapRef.current;
        if (!el || !el.classList.contains("is-dragging")) return;
        const dx = e.clientX - startX.current;
        if (Math.abs(dx) > 3) dragging.current = true;
        el.scrollLeft = startScroll.current - dx;
        e.preventDefault();
      }}
      onPointerUp={(e) => {
        wrapRef.current?.classList.remove("is-dragging");
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
        requestAnimationFrame(() => (dragging.current = false));
      }}
      onPointerCancel={(e) => {
        wrapRef.current?.classList.remove("is-dragging");
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
          onClick={(e) => {
            if (dragging.current) return; // ignoruojam jei buvo drag
            onPick(label);
            // Paliekam FOCUS (rodysis focused state)
            e.currentTarget.focus({ preventScroll: true });
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
