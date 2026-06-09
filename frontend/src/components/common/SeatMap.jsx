/**
 * Interactive seat map for selecting seats during booking.
 */
export default function SeatMap({ seats, selectedIds, onToggle }) {
  const rows = {};
  for (const seat of seats) {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  }

  return (
    <div className="seat-map">
      <div className="screen-indicator">SCREEN</div>
      {Object.entries(rows).map(([row, rowSeats]) => (
        <div key={row} className="seat-row">
          <span className="row-label">{row}</span>
          {rowSeats.map((seat) => {
            const isSelected = selectedIds.includes(seat.id);
            const isBooked = seat.is_booked;

            let cls = "seat";
            if (isBooked) cls += " seat-booked";
            else if (isSelected) cls += " seat-selected";
            else cls += ` seat-${seat.seat_type}`;

            return (
              <button
                key={seat.id}
                className={cls}
                disabled={isBooked}
                onClick={() => onToggle(seat.id)}
                title={`${seat.row}${seat.number} (${seat.seat_type})`}
              >
                {seat.number}
              </button>
            );
          })}
        </div>
      ))}
      <div className="seat-legend">
        <span><span className="seat seat-regular" /> Regular</span>
        <span><span className="seat seat-premium" /> Premium</span>
        <span><span className="seat seat-vip" /> VIP</span>
        <span><span className="seat seat-selected" /> Selected</span>
        <span><span className="seat seat-booked" /> Booked</span>
      </div>
    </div>
  );
}
