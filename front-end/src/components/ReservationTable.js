import React from "react";
import { Link } from "react-router-dom";

// maps through the reservation and renders all reservations for the date
function ReservationTable({ reservations, correctDate, cancelResHandler }) {
  return reservations.map((reservation) => {
    const {
      reservation_id,
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    } = reservation;

    return (
      <tr key={reservation_id}>
        <td>{reservation_id}</td>
        <td>
          {last_name}, {first_name}
        </td>
        <td>{mobile_number}</td>
        <td>{correctDate(reservation_date)}</td>
        <td>{reservation_time}</td>
        <td>{people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {status}
        </td>
        <td>
          {status === "booked" ? (
            <Link
              to={`/reservations/${reservation_id}/seat`}
              type="button"
              className="btn btn-secondary"
            >
              Seat
            </Link>
          ) : null}
        </td>
        <td>
          {status === "booked" ? (
            <Link
              type="button"
              className="btn btn-secondary"
              to={`/reservations/${reservation_id}/edit`}
            >
              Edit
            </Link>
          ) : null}
        </td>
        <td>
          {status === "booked" ? (
            <button
              type="button"
              className="btn btn-secondary"
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={cancelResHandler}
            >
              Cancel
            </button>
          ) : null}
        </td>
      </tr>
    );
  });
}

export default ReservationTable;
