import { useState } from "react";
import MovieCard from "../components/common/MovieCard";
import Spinner from "../components/common/Spinner";
import useFetch from "../hooks/useFetch";
import { getMovies, getGenres } from "../api/movies";

export default function MoviesPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  const { data: genres } = useFetch(getGenres);
  const { data: movies, loading } = useFetch(
    () => getMovies({ search, genres__slug: genre || undefined }),
    [search, genre],
  );

  return (
    <div className="container section">
      <h1>Movies</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search movies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="genre-select"
        >
          <option value="">All Genres</option>
          {genres?.map((g) => (
            <option key={g.id} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="movie-grid">
          {movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          {movies?.length === 0 && (
            <p className="empty-state">No movies found.</p>
          )}
        </div>
      )}
    </div>
  );
}
