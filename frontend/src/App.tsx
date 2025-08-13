import { useState } from "react";
import Background from "./app/Background";
import AiButton from "./app/AiButton";
import "./styles/layout.css";
import "./styles/button.css";

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <Background />
      <AiButton onOpen={() => setOpen(true)} />
      {/* Modal */}
    </div>
  );
}
