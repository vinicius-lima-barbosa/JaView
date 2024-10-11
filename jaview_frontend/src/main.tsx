import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Aside from "./components/aside.tsx";
import Header from "./components/header.tsx";
import MoviesList from "./components/movies-list";
import Footer from "./components/footer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="flex-h-screen flex">
      <Aside />
      <main className="flex-1 flex-col">
        <div className="p-5">
          <Header />
        </div>
        <MoviesList />
      </main>
    </div>
    <Footer />
  </StrictMode>
);
