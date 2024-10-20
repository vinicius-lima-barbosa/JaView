import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import MoviesList from "./pages/movies-list.tsx";
import MoviesDetails from "./pages/movies-details.tsx";
import Search from "./pages/search.tsx";
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import UserReviews from "./pages/user-reviews.tsx";
import TopRatedMovies from "./pages/top-rated-movies.tsx";
import ErrorPage from "./pages/error.tsx";
import SuccessPage from "./pages/success.tsx";
import Layout from "./layout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MoviesDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/user/reviews" element={<UserReviews />} />
          <Route path="/topRatedMovies" element={<TopRatedMovies />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </Layout>
    </Router>
  </StrictMode>
);
