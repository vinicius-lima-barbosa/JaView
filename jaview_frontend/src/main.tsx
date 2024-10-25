import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import MoviesList from "./pages/collections/movies-list.tsx";
import MoviesDetails from "./pages/collections/movies-details.tsx";
import Search from "./pages/search/search.tsx";
import Login from "./pages/auth/login.tsx";
import Register from "./pages/auth/register.tsx";
import UserReviews from "./pages/profiles/user-reviews.tsx";
import TopRatedMovies from "./pages/collections/top-rated-movies.tsx";
import ErrorPage from "./pages/responses/error.tsx";
import SuccessPage from "./pages/responses/success.tsx";
import Layout from "./layout.tsx";
import UserProfile from "./pages/profiles/user-profile.tsx";
import SearchUser from "./pages/search/search-user.tsx";

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
          <Route path="/top-rated-movies" element={<TopRatedMovies />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/search-user" element={<SearchUser />} />
          {/* <Route path="/users/:userId" element={<SearchUser />} /> */}
        </Routes>
      </Layout>
    </Router>
  </StrictMode>
);
