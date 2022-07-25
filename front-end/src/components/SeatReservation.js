import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, updateTable } from "../utils/api";

function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();

  // usestate variable to hold reservation and tables information along with function to set useState
  const [reservation, setReservation] = useState({});
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  // use effect to load page with reservation id
  // callback function loadSeatReservation to make api calls to receive information from backend and update state of said variables
  useEffect(loadSeatReservation, [reservation_id]);

  function loadSeatReservation() {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  // map through tables to add each table as an option in the select form

  const listTableOption = tables.map((table) => {
    return (
      <option
        key={table.table_id}
        value={table.table_id}
      >{`${table.table_name} - ${table.capacity}`}</option>
    );
  });

  // cancel click handler
  const cancelClick = () => {
    history.goBack();
  };

  // on change handler
  async function changeHandler(evt) {
    let tableVal = evt.target.value;
    setSelectedTable(tableVal);
  }

  // submit handler, will do put request
  // validate if capacity of table can accommodate #of people from reservation

  async function submitHandler(evt) {
    evt.preventDefault();
    let data = { reservation_id };
    const abortController = new AbortController();

    try {
      await updateTable(selectedTable, { data }, abortController.signal);
      history.push(`/dashboard`);
    } catch (err) {
      setError(err);
    }
  }

  // to format date
  let date = new Date(reservation.reservation_date);
  let formattedDate = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;

  return (
    <>
      <h1>Seat Reservation</h1>
      <ErrorAlert error={error} />
      <h3>{`# ${reservation.reservation_id} - ${reservation.first_name} ${reservation.last_name} on ${formattedDate} at ${reservation.reservation_time} for ${reservation.people}`}</h3>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="exampleFormControlSelect1">Seat at:</label>
          <select
            className="form-control"
            id="table_select"
            name="table_id"
            onChange={changeHandler}
          >
            <option value="">Select a table</option>
            {listTableOption}
          </select>
        </div>
        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={cancelClick}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
}

export default SeatReservation;
