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

  const taRef = useRef<HTMLTextAreaElement>(null);
  const MAX_H = 136; // turi sutapti su CSS .input-wrap max-height

  function updateFade(el: HTMLTextAreaElement) {
    const wrap = el.closest(".input-wrap") as HTMLElement | null;
    if (!wrap) return;

    const hasOverflow = el.scrollHeight > el.clientHeight + 0.5;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 0.5;

    wrap.classList.toggle("has-overflow", hasOverflow);
    wrap.classList.toggle("scrolled", !atTop);
    wrap.classList.toggle("has-more-below", !atBottom);
  }

  function autoresize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, MAX_H);
    el.style.height = next + "px";
    el.style.overflowY = el.scrollHeight > next ? "auto" : "hidden";
  }

  // focus + autosize kai peršokam į "typing"
  useEffect(() => {
    if (!open) return;
    if (view !== "typing") return;
    const el = taRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.value.length;
      el.selectionEnd = el.value.length;
      autoresize(el);
    });
  }, [open, view]);

  function pickChip(v: string) {
    setQuery(v);
    setView("typing");
    requestAnimationFrame(() => {
      if (taRef.current) autoresize(taRef.current);
    });
  }

  function submit() {
    if (!query.trim()) return;
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

  function handleBack() {
    if (view === "answer") {
      setView("typing");
      requestAnimationFrame(() => taRef.current?.focus());
    } else if (view === "typing") {
      setView("chips");
    } else {
      setOpen(false);
    }
  }

  return (
    <div className="app-shell">
      <Background />

      {!open && (
        <AiButton
          onOpen={() => {
            setOpen(true);
            reset();
            requestAnimationFrame(() => taRef.current?.focus());
          }}
        />
      )}

      <Modal
        open={open}
        onClose={() => {
          document.body.classList.remove("kb-open");
          setOpen(false);
        }}
        onBack={handleBack}
        title="Hello, what are you looking for today?"
      >
        {/* Chips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Chips items={CHIP_ITEMS} onPick={pickChip} />
        </div>

        {/* DOCK ties modal apačia (sticky mobilėje, absolute desktop) */}
        {view !== "answer" ? (
          <div className="input-dock">
            <form
              className="input-wrap"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                onFocus={() => {
                  document.body.classList.add("kb-open");
                }}
                onBlur={() => {
                  document.body.classList.remove("kb-open");
                }}
                aria-label="Message"
              />
              {/* MIC – neaktyvus, ne submit */}
              <button
                type="button"
                className="input-action"
                aria-label="Voice (coming soon)"
                aria-disabled="true"
                tabIndex={-1}
                onPointerDown={(e) => e.preventDefault()}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => e.preventDefault()}
              >
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
