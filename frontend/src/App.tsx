import { useEffect, useRef, useState } from "react";
import Background from "./app/Background";
import AiButton from "./app/AiButton";
import "./styles/layout.css";
import "./styles/button.css";
import "./styles/modal.css";
import Modal from "./app/Modal";
import Chips from "./app/Chips";
import "./styles/chips.css";
import VoiceIcon from "./assets/voice.svg?react";

type View = "chips" | "typing" | "answer";
const CHIP_ITEMS = ["Product", "Information", "Support", "Brand assets", "Consultation", "Dresses for summer"];

export default function App() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("chips");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  // autosize
  const taRef = useRef<HTMLTextAreaElement>(null);
  const MAX_H = 200;

  function updateFade(el: HTMLTextAreaElement) {
    const wrap = el.closest(".input-wrap") as HTMLElement | null;
    if (!wrap) return;

    const hasOverflow = el.scrollHeight > el.clientHeight + 0.5;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 0.5;

    wrap.classList.toggle("has-overflow", hasOverflow);
    wrap.classList.toggle("scrolled", el.scrollTop > 0);
    wrap.classList.toggle("scrolled", !atTop); // viršaus fade
    wrap.classList.toggle("has-more-below", !atBottom); // apačios fade
  }

  function autoresize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, MAX_H);
    el.style.height = next + "px";
    el.style.overflowY = el.scrollHeight > MAX_H ? "auto" : "hidden";
    updateFade(el);
  }
  useEffect(() => {
    if (taRef.current) autoresize(taRef.current);
  }, [open, query]);

  function pickChip(v: string) {
    setQuery(v);
    setView("typing");
  }
  function submit() {
    setTimeout(() => {
      setAnswer("Lorem ipsum response bubble…");
      setView("answer");
    }, 400);
  }
  function reset() {
    setQuery("");
    setAnswer("");
    setView("chips");
  }

  return (
    <div className="app-shell">
      <Background />
      {!open && (
        <AiButton
          onOpen={() => {
            setOpen(true);
            reset();
          }}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Hello, what are you looking for today?">
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <Chips items={CHIP_ITEMS} onPick={pickChip} />
        </div>

        {/* DOCK ties modal apačia */}
        {view !== "answer" ? (
          <div className="input-dock">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="input-wrap"
            >
              <textarea
                ref={taRef}
                className="input-field"
                value={query}
                placeholder="Ask anything…"
                onInput={(e) => {
                  setQuery(e.currentTarget.value);
                  autoresize(e.currentTarget);
                }}
                onScroll={(e) => updateFade(e.currentTarget)}
              />
              <button type="submit" className="input-action" aria-label="Send or voice">
                <VoiceIcon width={20} height={20} aria-hidden="true" focusable="false" />
              </button>
            </form>
          </div>
        ) : (
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#E7E9F2",
              borderRadius: 14,
              padding: "12px 14px",
              border: "1px solid rgba(255,255,255,0.18)",
              maxWidth: "90%",
            }}
          >
            {answer}
          </div>
        )}
      </Modal>
    </div>
  );
}
