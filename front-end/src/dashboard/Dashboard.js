import React, { useEffect, useState } from "react";
import { deleteTableResId, listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import { useHistory, Link } from "react-router-dom";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [date, setDate] = useState(today());

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
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

  // create variable for the useHistory
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

  // handler for the finish button

  const finishHandler = async (evt) => {
    if (
      window.confirm(`Is this table ready to seat new guests? 

This cannot be undone.`)
    ) {
      evt.preventDefault();
      let {tableIdFinish} = evt.target.dataset
      
      const abortController = new AbortController();
      await deleteTableResId(tableIdFinish, abortController.signal);
      history.go(0)
    } else {
      return null;
    }
  };

  // add one hour to reservation to the dashboard, database server in ireland gmt+1
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
    const {
      reservation_id,
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    } = reservation;
    if (reservations.length === 0) {
      return (
        <tr>
          <td colSpan={6}> No Reservations Found.</td>
        </tr>
      );
    }
    return (
      <tr key={index}>
        <td>{reservation_id}</td>
        <td>
          {first_name} {last_name}
        </td>
        <td>{mobile_number}</td>
        <td>{correctDate(reservation_date)}</td>
        <td>{reservation_time}</td>
        <td>{people}</td>
        <td>status</td>
        <td>
          <Link
            to={`/reservations/${reservation_id}/seat`}
            type="button"
            className="btn btn-secondary"
          >
            Seat
          </Link>
        </td>
        <td>
          <button type="button" className="btn btn-secondary">
            Edit
          </button>
        </td>
        <td>
          <button type="button" className="btn btn-secondary">
            Cancel
          </button>
        </td>
      </tr>
    );
  });

  // maps through the tables and renders all tables

  const tablesList = tables.map((table, index) => {
    return (
      <tr key={index}>
        <td>{table.table_id}</td>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>
          {table.reservation_id ? <p>Occupied</p> : <p>Free</p>}
        </td>
        <td>
          {table.reservation_id ? (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              data-table-id-finish={table.table_id}
              onClick={finishHandler}
            >
              Finish
            </button>
          ) : null}
        </td>
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
          <ErrorAlert error={reservationsError || tablesError} />
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
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="table-responsive">
            <table className="table no-wrap">
              <thead>
                <tr>
                  <th className="border-top-0">#</th>
                  <th className="border-top-0">TABLE NAME</th>
                  <th className="border-top-0">CAPACITY</th>
                  <th className="border-top-0">FREE?</th>
                </tr>
              </thead>
              <tbody>{tablesList}</tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
