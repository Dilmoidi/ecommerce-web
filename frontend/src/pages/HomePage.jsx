import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import MovieCard from "../components/common/MovieCard";
import Spinner from "../components/common/Spinner";
import useFetch from "../hooks/useFetch";
import { getMovies } from "../api/movies";

export default function HomePage() {
  const { data: movies, loading } = useFetch(() => getMovies({ page_size: 6 }));

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Book Your Movie Experience</h1>
          <p>
            Browse the latest movies, choose your seats, and book tickets
            instantly with CineBook.
          </p>
          <Link to="/movies" className="btn btn-primary btn-lg">
            Browse Movies <FiArrowRight />
          </Link>
        </div>
      </section>

      <section className="container section">
        <div className="section-header">
          <h2>Now Showing</h2>
          <Link to="/movies">View All</Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="movie-grid">
            {movies?.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
            {movies?.length === 0 && (
              <p className="empty-state">No movies available right now.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
