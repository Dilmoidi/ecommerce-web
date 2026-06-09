import { Link, useNavigate } from "react-router-dom";
import { FiFilm, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <FiFilm size={24} />
          <span>CineBook</span>
        </Link>

        <div className="navbar-links">
          <Link to="/movies">Movies</Link>
          {user ? (
            <>
              <Link to="/my-bookings">My Bookings</Link>
              <Link to="/profile" className="nav-user">
                <FiUser size={16} />
                {user.username}
              </Link>
              <button onClick={handleLogout} className="btn-link" title="Logout">
                <FiLogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
