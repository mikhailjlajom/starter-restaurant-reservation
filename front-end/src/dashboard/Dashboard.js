import React, { useEffect, useState } from "react";
import {
  cancelReservation,
  deleteTableResId,
  listReservations,
  listTables,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";
import ReservationList from "../components/ReservationList";
import TableList from "../components/TableList";

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

  const cancelResHandler = async (evt) => {
    if (
      window.confirm(`Do you want to cancel this reservation?
      
This cannot be undone.`)
    ) {
      evt.preventDefault();
      let { reservationIdCancel } = evt.target.dataset;
      let data = {status:"cancelled"}
      const abortController = new AbortController();
      await cancelReservation(
        reservationIdCancel,
        data,
        abortController.signal
      );
      history.go(0)
    } else {
      return null;
    }
  };

  // handler for the finish button

  const finishHandler = async (evt) => {
    if (
      window.confirm(`Is this table ready to seat new guests? 

This cannot be undone.`)
    ) {
      evt.preventDefault();
      let { tableIdFinish } = evt.target.dataset;

      const abortController = new AbortController();
      await deleteTableResId(tableIdFinish, abortController.signal);
      history.go(0);
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

  // maps through the tables and renders all tables

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
              <span className="oi oi-arrow-left"></span>
            </button>
            <button
              type="button"
              className="btn btn-primary mx-1"
              onClick={todayHandler}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={nextHandler}
            >
              <span className="oi oi-arrow-right"></span>
              Next
            </button>
          </div>
          <ErrorAlert error={reservationsError || tablesError} />
          <ReservationList
            reservations={reservations}
            correctDate={correctDate}
            cancelResHandler={cancelResHandler}
          />
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12">
          <div className="table-responsive">
            <table className="table no-wrap">
              <thead className="thead-light">
                <tr>
                  <th className="border-top-0">#</th>
                  <th className="border-top-0">TABLE NAME</th>
                  <th className="border-top-0">CAPACITY</th>
                  <th className="border-top-0">FREE?</th>
                </tr>
              </thead>
              <tbody>
                <TableList tables={tables} finishHandler={finishHandler} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
