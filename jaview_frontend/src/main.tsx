import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Aside from "./components/aside.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex-h-screen">
      <Aside />
    </div>
  </StrictMode>
);
