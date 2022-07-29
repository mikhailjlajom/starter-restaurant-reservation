import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import ReservationList from "./ReservationList";

function SearchForm() {
  const initialSearchState = {
    mobile_number: "",
  };

  const [numberSearch, setNumberSearch] = useState(initialSearchState);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null)

  function correctDate(date) {
    let correctedDate = new Date(date);

    let newDate = correctedDate.setDate(correctedDate.getDate() + parseInt(1));

    let finalDate = new Date(newDate).toLocaleString();

    return finalDate.slice(0, 9);
  }

  // function for change handler

  function changeHandler(evt) {
    const resKey = evt.target.name;
    let resVal = evt.target.value;
    setNumberSearch({
      ...numberSearch,
      [resKey]: resVal,
    });
  }

  // function for find handler submit

  async function findHandler(evt) {
    evt.preventDefault();
    try {
      const abortController = new AbortController();
      let response = await listReservations(
        numberSearch,
        abortController.signal
      );
      
      setReservations(response);
      setNumberSearch(initialSearchState);
    } catch (error) {
      setReservationsError(error);
    }
  }

  return (
    <div>
      <h1>Search Reservations</h1>
      <fieldset>
        <ErrorAlert error={reservationsError}/>
        <div className="row">
          <div className="form-group col-md-6 col-sm-12">
            <form onSubmit={findHandler}>
              <label htmlFor="mobile_number">Mobile Number:</label>
              <div className="input-group">
                <input
                  type="tel"
                  className="form-control"
                  id="mobile_number"
                  name="mobile_number"
                  placeholder="Enter the customer's phone number"
                  onChange={changeHandler}
                  value={numberSearch.mobile_number}
                />
                <div className="input-group-append">
                  <button type="submit" className="btn btn-primary">
                    <span className="oi oi-magnifying-glass"></span>
                    Find
                  </button>
                </div>
                {reservations ? (
                  <ReservationList
                    reservations={reservations}
                    correctDate={correctDate}
                  />
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export default SearchForm;
