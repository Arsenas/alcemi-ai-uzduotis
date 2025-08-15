import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import "../styles/modal-anim.css";
import "../styles/modal.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  children: ReactNode;
  mode?: "default" | "answer";
};

function withResponsiveBreaks(text: string) {
  const m = text.match(/^(.*?\bare you)\s+(looking)\b(.*)$/i);
  if (!m) return text;
  const before = m[1];
  const looking = m[2];
  const after = m[3];
  return (
    <>
      {before}
      <span className="break--mobile" aria-hidden="true">
        <br />
      </span>{" "}
      {looking}{" "}
      <span className="break--desktop" aria-hidden="true">
        <br />
      </span>
      {after.trimStart()}
    </>
  );
}

export default function Modal({ open, onClose, onBack, title, children, mode = "default" }: Props) {
  const [show, setShow] = useState(open);
  const lockedScrollY = useRef(0);

  // 1) Body scroll lock (iOS-proof)
  useEffect(() => {
    const body = document.body;
    if (open) {
      setShow(true);

      // užlockinam puslapį po modalu
      lockedScrollY.current = window.scrollY;
      body.style.position = "fixed";
      body.style.top = `-${lockedScrollY.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      // mažina scroll chain tikimybę
      body.style.overscrollBehavior = "none";
      body.style.touchAction = "none";
    } else if (show) {
      // atlaisvinam
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      body.style.overscrollBehavior = "";
      body.style.touchAction = "";
      window.scrollTo(0, lockedScrollY.current);
      setShow(false);
    }
  }, [open, show]);

  // 2) VisualViewport → --vvh + body.kb-open
  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    const baseInnerH = window.innerHeight; // startinė „pilno“ ekrano reikšmė

    const updateVVH = () => {
      const h = vv ? vv.height : window.innerHeight;
      document.documentElement.style.setProperty("--vvh", `${Math.round(h)}px`);

      // jei height reikšmingai mažesnis už bazinį → laikom, kad atsidarė klaviatūra
      const kbOpen = h < baseInnerH - 80;
      document.body.classList.toggle("kb-open", kbOpen);
    };

    updateVVH();
    vv?.addEventListener("resize", updateVVH);
    vv?.addEventListener("scroll", updateVVH);
    window.addEventListener("orientationchange", updateVVH);

    return () => {
      vv?.removeEventListener("resize", updateVVH);
      vv?.removeEventListener("scroll", updateVVH);
      window.removeEventListener("orientationchange", updateVVH);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!show) return null;

  return (
    <div
      id="ai-modal"
      className="modal-root open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="backdrop" />
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-ctr">
          <div className="modal-head" role="toolbar" aria-label="AI modal navigation">
            <button type="button" className="head-logo-mobile" aria-label="Back" onClick={onBack ?? onClose}>
              <img src="/img/logo-mobile.svg" alt="Alcemi" />
            </button>

            <button className="icon-btn head-back" aria-label="Back" onClick={onBack ?? onClose}>
              <img src="/img/back.svg" alt="" aria-hidden="true" />
            </button>

            <div className="head-spacer" aria-hidden />

            <button className="icon-btn head-close" aria-label="Close" onClick={onClose}>
              <img src="/img/close.svg" alt="" aria-hidden="true" />
            </button>
          </div>

          <div className={`modal-col ${mode === "answer" ? "is-answer" : ""}`}>
            {mode !== "answer" && (
              <h1 id="modal-title" className="modal-title">
                {withResponsiveBreaks(title)}
              </h1>
            )}
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
