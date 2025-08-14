import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import "../styles/modal-anim.css";
import "../styles/modal.css";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/**
 * Įterpia DU galimus laužymo taškus:
 * - MOBILE: prieš "looking"
 * - DESKTOP: prieš "for today?"
 * Kuris bus rodomas – valdoma CSS .break--mobile / .break--desktop
 */
function withResponsiveBreaks(text: string) {
  // "Hello, what are you looking for today?"
  // -> before="Hello, what are you", word="looking", after=" for today?"
  const m = text.match(/^(.*?\bare you)\s+(looking)\b(.*)$/i);
  if (!m) return text;

  const before = m[1];
  const looking = m[2];
  const after = m[3]; // starts with space: " for today?"

  return (
    <>
      {before}
      {/* MOBILE break (prieš "looking") */}
      <span className="break--mobile" aria-hidden="true">
        <br />
      </span>{" "}
      {looking}
      {/* DESKTOP break (prieš "for today?") */}{" "}
      <span className="break--desktop" aria-hidden="true">
        <br />
      </span>
      {after.trimStart()}
    </>
  );
}

export default function Modal({ open, onClose, title, children }: Props) {
  const [show, setShow] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      setClosing(false);
      document.body.style.overflow = "hidden";
    } else if (show) {
      setClosing(true);
      const t = setTimeout(() => {
        setShow(false);
        setClosing(false);
        document.body.style.overflow = "";
      }, 380);
      return () => clearTimeout(t);
    }
  }, [open, show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!show) return null;

  return (
    <div
      className={`modal-root ${open || closing ? "open" : ""} ${closing ? "closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="backdrop" onClick={onClose} />
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-ctr">
          <div className="modal-head" role="toolbar" aria-label="AI modal navigation">
            <a className="head-logo-mobile" href="/" aria-label="Alcemi home">
              <img src="/img/logo-mobile.svg" alt="Alcemi" />
            </a>
            <button className="icon-btn head-back" aria-label="Back">
              <img src="/img/back.svg" alt="" aria-hidden="true" />
            </button>
            <div className="head-spacer" aria-hidden />
            <button className="icon-btn head-close" aria-label="Close" onClick={onClose}>
              <img src="/img/close.svg" alt="" aria-hidden="true" />
            </button>
          </div>

          <div className="modal-col">
            <h1 id="modal-title" className="modal-title">
              {withResponsiveBreaks(title)}
            </h1>
            <div className="modal-body">{children}</div>
          </div>

          <div className="modal-footer">
            <img className="powered-by" src="/img/logo-desktop.svg" alt="Powered by Alcemi" />
          </div>
        </div>
      </div>
    </div>
  );
}
