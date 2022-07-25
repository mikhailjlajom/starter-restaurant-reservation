import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { today } from "../utils/date-time";

// reservation form component
// reservations/new route
function ReservationForm() {
  // create initial form state
  let initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: ""
  };

  // when cancel is clicked go back to previous page
  const cancelClick = () => {
    history.goBack();
  };

  // useState variable and function for creating new reservation
  const [newReservation, setNewReservation] = useState(initialState);

  // useState for errors
  const [errorsList, setErrorsList] = useState([]);

  // create function that validates Date for new reservation, sends errors and pushes it to useState array of errorsList
  // if reservation is made on Tuesday pass error "Restaurant is Closed on Tuesdays"
  // if reservation is made in the past "Only future reservations are allowed."

  function dateTimeChecker() {
    // convert date with new Date object
    // get day of converted date
    // name variable for empty array
    // if day = 2 send error message
    // if date > then today send error message

    let errorsArray = [];
    let date = today();
    let todaysDate = new Date(date);

    // date and day checker part of function
    const newReservationDate = newReservation.reservation_date;
    const reservationDate = new Date(newReservationDate);

    let reservationDay = reservationDate.getUTCDay();

    if (reservationDay === 2) {
      errorsArray.push({ message: "Restaurant is closed on Tuesdays." });
    }
    if (reservationDate < todaysDate) {
      errorsArray.push({ message: "Only future reservations are allowed." });
    }

    // time checker part of function
    // create variables for hours and minutes of reservationDate

    let reservationHour = parseInt(newReservation.reservation_time.slice(0, 2));
    let reservationMins = parseInt(newReservation.reservation_time.slice(3));

    // create if statements for time frame of reservation time
    // checks if reservation time is on or before 10:30am

    if (reservationHour <= 10 && reservationMins <= 30) {
      errorsArray.push({ message: "The reservation time is before 10:30 AM." });
    }

    // checks if reservation time is from 9:30pm-10:30pm
    if (
      (reservationHour === 21 && reservationMins >= 30) ||
      (reservationHour === 22 && reservationMins <= 30)
    ) {
      errorsArray.push({
        message:
          "the restaurant closes at 10:30 PM and the customer needs to have time to enjoy their meal.",
      });
    }

    // checks if reservation time is from 10:31pm onwards
    if (
      (reservationHour === 22 && reservationMins > 30) ||
      reservationHour >= 23
    ) {
      errorsArray.push({
        message: "the restaurant is closed",
      });
    }

    // check if reservations that are made today are done after 12pm
    if (
      reservationDate >= todaysDate &&
      reservationHour < 12 &&
      reservationMins <= 0
    ) {
      errorsArray.push({
        message: "Reservations for today should be made after 12 noon.",
      });
    }

    if (errorsArray.length === 0) {
      return true;
    } else {
      setErrorsList(errorsArray);
      return false;
    }
  }

  // map through list of errors
  const mappedErrors = errorsList.map((oneError, index) => {
    if (errorsList.length === 0) {
      return null;
    }
    return <li key={index}>{oneError.message}</li>;
  });

  // submit handler function
  // after submitting should send data to backend
  // also should go back to dashboard with reservations list
  // when submit is clicked go to dashboard with submitted reservation date
  async function submitHandler(evt) {
    evt.preventDefault();
    try {
      if (dateTimeChecker()) {
        const abortController = new AbortController();
        await createReservation(
          { data: newReservation },
          abortController.signal
        );
        history.push(`/dashboard?date=${newReservation.reservation_date}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // change handler function
  // change the people value string to a number
  // can allow changeHandler function to add dashes for phone numbers

  function changeHandler(evt) {
    const resKey = evt.target.name;
    let resValue = evt.target.value;
    if (resKey === "people" && resValue) {
      resValue = parseInt(resValue);
    }
    setNewReservation({
      ...newReservation,
      [resKey]: resValue,
    });
  }

  // allows to call the useHistory function
  let history = useHistory();

  // the format of the form
  // styling if possible using bootstrap
  // requires 6 fields first_name,last_name,mobile_number,reservation_date,reservation_time, & people

  return (
    <>
      <fieldset>
        <h1>Create Reservation</h1>
        <div>
          {errorsList.length > 0 ? (
            <div className="alert alert-danger m-2">
              <p>Please fix the following errors:</p>
              <ul>{mappedErrors}</ul>
            </div>
          ) : null}
        </div>
        <form onSubmit={submitHandler}>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label>First Name</label>
              <br></br>
              <input
                type="text"
                id="first_name"
                name="first_name"
                required={true}
                placeholder="First Name"
                onChange={changeHandler}
                className="form-control"
                value={newReservation.first_name}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Last Name</label>
              <br></br>
              <input
                type="text"
                id="last_name"
                name="last_name"
                required={true}
                placeholder="Last Name"
                onChange={changeHandler}
                className="form-control"
                value={newReservation.last_name}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Mobile Number</label>
              <br></br>
              <input
                type="tel"
                id="mobile_number"
                name="mobile_number"
                required={true}
                placeholder="000-000-0000"
                onChange={changeHandler}
                className="form-control"
                value={newReservation.mobile_number}
                maxLength="12"
                // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label>Reservation Date</label>
              <br></br>
              <input
                type="date"
                id="reservation_date"
                name="reservation_date"
                required={true}
                onChange={changeHandler}
                className="form-control"
                value={newReservation.reservation_date}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Reservation Time</label>
              <br></br>
              <input
                type="time"
                id="reservation_time"
                name="reservation_time"
                required={true}
                onChange={changeHandler}
                className="form-control"
                value={newReservation.reservation_time}
              />
            </div>
            <div className="form-group col-md-4">
              <label>People</label>
              <br></br>
              <input
                type="number"
                id="people"
                name="people"
                required={true}
                placeholder="1"
                onChange={changeHandler}
                className="form-control"
                value={newReservation.people}
              />
            </div>
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
      </fieldset>
    </>
  );
}

export default ReservationForm;
