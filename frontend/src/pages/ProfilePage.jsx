import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { changePassword, updateProfile } from "../api/auth";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
  });
  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "" });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      await refreshUser();
      toast.success("Profile updated.");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPw(true);
    try {
      await changePassword(pwForm);
      toast.success("Password changed.");
      setPwForm({ old_password: "", new_password: "" });
    } catch (err) {
      const msg =
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.new_password?.[0] ||
        "Failed to change password.";
      toast.error(msg);
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="container section profile-page">
      <h1>Profile</h1>

      <div className="profile-card">
        <h2>Account Information</h2>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Username:</strong> {user?.username}
        </p>
        <p>
          <strong>Member since:</strong>{" "}
          {user?.created_at && new Date(user.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="profile-card">
        <h2>Update Profile</h2>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              id="phone_number"
              value={form.phone_number}
              onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="profile-card">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="old_password">Current Password</label>
            <input
              id="old_password"
              type="password"
              required
              value={pwForm.old_password}
              onChange={(e) =>
                setPwForm({ ...pwForm, old_password: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="new_password">New Password</label>
            <input
              id="new_password"
              type="password"
              required
              value={pwForm.new_password}
              onChange={(e) =>
                setPwForm({ ...pwForm, new_password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={changingPw}
          >
            {changingPw ? "Changing…" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
