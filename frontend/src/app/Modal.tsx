import { ReactNode, useEffect, useState } from "react";
import "../styles/gradients.css";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  const [show, setShow] = useState(open);

  // Mount/unmount su vėlavimu, kad matytųsi uždarymo animacija
  useEffect(() => {
    if (open) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      const t = setTimeout(() => setShow(false), 260); // šiek tiek daugiau nei CSS transition
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
  }, [open]);

  // ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!show) return null;

  return (
    <div
      className={`modal-root ${open ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      id="ai-modal"
    >
      <div className="backdrop" onClick={onClose} />
      <div className="modal-card">
        {/* Gradientiniai sluoksniai */}
        <div className="modal-gradients">
          <div className="gradient-layer gradient-rect" />
          <div className="gradient-layer gradient-v62" />
          <div className="gradient-layer gradient-v62-big" />
        </div>

        <div className="modal-head">
          <button className="ghost" aria-label="Back">
            ←
          </button>
          <h1 id="modal-title">{title}</h1>
          <button className="ghost" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
