import { useState } from "react";
import Background from "./app/Background";
import AiButton from "./app/AiButton";
import "./styles/layout.css";
import "./styles/button.css";
import "./styles/modal.css";
import Modal from "./app/Modal";

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <Background />
      <AiButton onOpen={() => setOpen(true)} />
      <Modal open={open} onClose={() => setOpen(false)} title="Hello, what are you looking for today?">
        {/* čia vėliau bus Chips + Input/Bubble */}
        <div />
      </Modal>
    </div>
  );
}
