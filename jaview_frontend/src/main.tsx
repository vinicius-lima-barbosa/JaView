import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Aside from "./components/aside.tsx";
import Header from "./components/header.tsx";
import MoviesList from "./pages/movies-list.tsx";
import Footer from "./components/footer.tsx";
import MoviesDetails from "./pages/movies-details.tsx";
import Search from "./pages/search.tsx";
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import UserReviews from "./pages/user-reviews.tsx";
import TopRatedMovies from "./pages/top-rated-movies.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <div className="flex-h-screen flex">
        <Aside />
        <main className="flex-1 flex-col">
          <div className="p-5">
            <Header />
          </div>
          <Routes>
            <Route path="/" element={<MoviesList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movie/:id" element={<MoviesDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/user/reviews" element={<UserReviews />} />
            <Route path="/topRatedMovies" element={<TopRatedMovies />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  </StrictMode>
);
