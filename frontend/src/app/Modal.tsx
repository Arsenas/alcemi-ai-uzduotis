import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-root" role="dialog" aria-modal="true" aria-labelledby="modal-title" id="ai-modal">
      <div className="backdrop" onClick={onClose} />
      <div className="modal-card">
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
