import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import SeatMap from "../components/common/SeatMap";
import Spinner from "../components/common/Spinner";
import useFetch from "../hooks/useFetch";
import { getShowtimeSeats } from "../api/theaters";
import { createBooking } from "../api/bookings";

export default function BookingPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(false);

  const { data: seats, loading } = useFetch(
    () => getShowtimeSeats(showtimeId),
    [showtimeId],
  );

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : prev.length < 10
          ? [...prev, seatId]
          : prev,
    );
  };

  const handleBook = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.");
      return;
    }
    setBooking(true);
    try {
      await createBooking({
        showtime_id: Number(showtimeId),
        seat_ids: selectedSeats,
      });
      toast.success("Booking confirmed!");
      navigate("/my-bookings");
    } catch (err) {
      const detail = err.response?.data;
      const msg =
        typeof detail === "string"
          ? detail
          : detail?.seat_ids?.join(" ") ||
            detail?.detail ||
            "Booking failed.";
      toast.error(msg);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container section booking-page">
      <h1>Select Your Seats</h1>
      <p className="subtitle">You can select up to 10 seats.</p>

      {seats && (
        <SeatMap
          seats={seats}
          selectedIds={selectedSeats}
          onToggle={toggleSeat}
        />
      )}

      <div className="booking-summary">
        <p>
          <strong>Selected:</strong> {selectedSeats.length} seat(s)
        </p>
        <button
          onClick={handleBook}
          disabled={booking || selectedSeats.length === 0}
          className="btn btn-primary btn-lg"
        >
          {booking ? "Booking…" : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
