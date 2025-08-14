import { useState } from "react";
import Background from "./app/Background";
import AiButton from "./app/AiButton";
import "./styles/layout.css";
import "./styles/button.css";
import "./styles/modal.css";
import Modal from "./app/Modal";
import Chips from "./app/Chips";
import "./styles/chips.css";

// SVG kaip React komponentas (failas yra src/assets/voice.svg)
import VoiceIcon from "./assets/voice.svg?react";

type View = "chips" | "typing" | "answer";
const CHIP_ITEMS = ["Product", "Information", "Support", "Brand assets", "Consultation", "Dresses for summer"];

export default function App() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("chips");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

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

        <div style={{ minHeight: 80 }}>
          {view !== "answer" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="input-wrap"
            >
              <textarea
                className="input-field"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything…"
              />
              <button type="submit" className="input-action" aria-label="Send or voice">
                {/* pats SVG yra mygtuko turinys */}
                <VoiceIcon width={20} height={20} aria-hidden="true" focusable="false" />
              </button>
            </form>
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
        </div>
      </Modal>
    </div>
  );
}
