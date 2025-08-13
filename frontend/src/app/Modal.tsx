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

function withBreakAfterLooking(text: string) {
  const m = text.match(/^(.*\blooking)\b(.*)$/i);
  if (!m) return text;
  return (
    <>
      {m[1]}
      <br />
      {m[2].trimStart()}
    </>
  );
}

export default function Modal({ open, onClose, title, children }: Props) {
  const [show, setShow] = useState(open);

  useEffect(() => {
    if (open) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      const t = setTimeout(() => setShow(false), 260);
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!show) return null;

  return (
    <div className={`modal-root ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="backdrop" onClick={onClose} />
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-ctr">
          {/* NAV BAR */}
          <div className="modal-head">
            <button className="ghost" aria-label="Back">
              ←
            </button>
            <button className="ghost" aria-label="Close" onClick={onClose}>
              ×
            </button>
          </div>

          {/* H1 */}
          <h1 id="modal-title" className="modal-title">
            {withBreakAfterLooking(title)}
          </h1>

          {/* TURINIO BLOKAS */}
          <div className="modal-body">{children}</div>

          {/* FOOTER LOGO */}
          <div className="modal-footer">
            <img className="powered-by" src="/img/logo-desktop.svg" alt="Powered by Alcemi" />
          </div>
        </div>
      </div>
    </div>
  );
}
