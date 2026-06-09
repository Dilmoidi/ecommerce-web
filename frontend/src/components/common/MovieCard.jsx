import { Link } from "react-router-dom";
import { FiClock, FiStar } from "react-icons/fi";

export default function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <Link to={`/movies/${movie.slug}`}>
        <div className="movie-card-poster">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} />
          ) : (
            <div className="poster-placeholder">No Poster</div>
          )}
          <span className="movie-rating-badge">{movie.rating}</span>
        </div>
        <div className="movie-card-body">
          <h3>{movie.title}</h3>
          <div className="movie-card-meta">
            <span>
              <FiClock size={14} /> {movie.duration_minutes} min
            </span>
            <span>
              <FiStar size={14} /> {movie.average_rating}
            </span>
          </div>
          <div className="movie-card-genres">
            {movie.genres?.map((g) => (
              <span key={g.id} className="genre-tag">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
