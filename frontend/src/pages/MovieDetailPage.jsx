import { Link, useParams } from "react-router-dom";
import { FiCalendar, FiClock, FiStar } from "react-icons/fi";
import Spinner from "../components/common/Spinner";
import useFetch from "../hooks/useFetch";
import { getMovie } from "../api/movies";
import { getShowtimes } from "../api/theaters";

export default function MovieDetailPage() {
  const { slug } = useParams();
  const { data: movie, loading } = useFetch(() => getMovie(slug), [slug]);
  const { data: showtimes } = useFetch(
    () => getShowtimes({ movie__slug: slug }),
    [slug],
  );

  if (loading) return <Spinner />;
  if (!movie) return <p className="container">Movie not found.</p>;

  return (
    <div className="container section movie-detail">
      <div className="movie-detail-header">
        <div className="movie-detail-poster">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} />
          ) : (
            <div className="poster-placeholder large">No Poster</div>
          )}
        </div>
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta-row">
            <span className="badge">{movie.rating}</span>
            <span>
              <FiClock /> {movie.duration_minutes} min
            </span>
            <span>
              <FiStar /> {movie.average_rating}/10
            </span>
            <span>
              <FiCalendar /> {movie.release_date}
            </span>
            <span>{movie.language}</span>
          </div>
          <div className="genre-tags">
            {movie.genres?.map((g) => (
              <span key={g.id} className="genre-tag">
                {g.name}
              </span>
            ))}
          </div>
          <p className="movie-description">{movie.description}</p>
          {movie.trailer_url && (
            <a
              href={movie.trailer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Watch Trailer
            </a>
          )}
        </div>
      </div>

      <section className="showtimes-section">
        <h2>Available Showtimes</h2>
        {showtimes?.length > 0 ? (
          <div className="showtime-grid">
            {showtimes.map((st) => (
              <div key={st.id} className="showtime-card">
                <div className="showtime-card-header">
                  <strong>{st.theater_name}</strong>
                  <span className="badge">{st.screen_type}</span>
                </div>
                <p>
                  {st.screen_name} &middot;{" "}
                  {new Date(st.start_time).toLocaleString()}
                </p>
                <p className="showtime-prices">
                  Regular: ${st.price_regular} &middot; Premium: $
                  {st.price_premium} &middot; VIP: ${st.price_vip}
                </p>
                <p className="seats-available">
                  {st.available_seats} seats available
                </p>
                <Link to={`/book/${st.id}`} className="btn btn-primary btn-sm">
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No showtimes available for this movie.</p>
        )}
      </section>
    </div>
  );
}
