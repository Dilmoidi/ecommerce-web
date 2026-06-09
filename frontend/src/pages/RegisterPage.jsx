import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../api/auth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const msg = Object.values(errors).flat().join(" ");
        toast.error(msg);
      } else {
        toast.error("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password_confirm">Confirm Password</label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              required
              value={form.password_confirm}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
