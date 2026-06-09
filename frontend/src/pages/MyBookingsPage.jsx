import toast from "react-hot-toast";
import { FiXCircle } from "react-icons/fi";
import Spinner from "../components/common/Spinner";
import useFetch from "../hooks/useFetch";
import { getBookings, cancelBooking } from "../api/bookings";

export default function MyBookingsPage() {
  const { data: bookings, loading, refetch } = useFetch(getBookings);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled.");
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Cancellation failed.");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container section">
      <h1>My Bookings</h1>
      {bookings?.length > 0 ? (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <div className="booking-card-main">
                <h3>{b.movie_title}</h3>
                <p>
                  {b.theater_name} &middot;{" "}
                  {new Date(b.start_time).toLocaleString()}
                </p>
                <p>
                  {b.seat_count} seat(s) &middot; <strong>${b.total_amount}</strong>
                </p>
              </div>
              <div className="booking-card-status">
                <span className={`status-badge status-${b.status}`}>
                  {b.status}
                </span>
                {b.status === "confirmed" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="btn btn-danger btn-sm"
                    title="Cancel Booking"
                  >
                    <FiXCircle /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state">You have no bookings yet.</p>
      )}
    </div>
  );
}
