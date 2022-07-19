import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(today());

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // create variable for query
  const query = useQuery();
  let queryDate = query.get("date");

  // useEffect runs the function everytime the queryDate changes
  useEffect(dateChange, [queryDate]);

  function dateChange() {
    if (queryDate) {
      setDate(queryDate);
    } else {
      setDate(today());
    }
  }

  const history = useHistory();

  // handlers for buttons prev, today, and next

  const prevHandler = async () => {
    history.push(`/dashboard?date=${previous(date)}`);
  };

  const nextHandler = async () => {
    history.push(`/dashboard?date=${next(date)}`);
  };

  const todayHandler = () => {
    history.push(`/dashboard`);
  };

  // add one hour to reservation to the dashboard
  // convert epoch time to proper mm/dd/year
  // slice date to only have mm/dd/year

  function correctDate(date) {
    let correctedDate = new Date(date);

    let newDate = correctedDate.setDate(correctedDate.getDate() + parseInt(1));

    let finalDate = new Date(newDate).toLocaleString();

    return finalDate.slice(0, 9);
  }

  // maps through the reservation and renders all reservations for the date

  const reservationsList = reservations.map((reservation, index) => {
    if (reservations.length === 0) {
      return (
        <tr>
          <td colSpan={6}> No Reservations Found.</td>
        </tr>
      );
    }
    return (
      <tr key={index}>
        <td>{reservation.reservation_id}</td>
        <td>
          {reservation.first_name} {reservation.last_name}
        </td>
        <td>{reservation.mobile_number}</td>
        <td>{correctDate(reservation.reservation_date)}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.people}</td>
        <td>status</td>
      </tr>
    );
  });

  
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4 className="box-title mb-0">Reservations for {date}</h4>
          </div>
          <div className="button-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={prevHandler}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={todayHandler}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={nextHandler}
            >
              Next
            </button>
          </div>
          <ErrorAlert error={reservationsError} />
          <div className="table-responsive">
            <table className="table no-wrap">
              <thead>
                <tr>
                  <th className="border-top-0">#</th>
                  <th className="border-top-0">NAME</th>
                  <th className="border-top-0">PHONE</th>
                  <th className="border-top-0">DATE</th>
                  <th className="border-top-0">TIME</th>
                  <th className="border-top-0">PEOPLE</th>
                  <th className="border-top-0">STATUS</th>
                </tr>
              </thead>
              <tbody>{reservationsList}</tbody>
            </table>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12"></div>
      </div>
    </main>
  );
}

export default Dashboard;
