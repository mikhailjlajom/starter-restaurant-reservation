import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";

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
    people: 0,
  };

  let history = useHistory();

  // when submit is clicked go to dashboard

  // when cancel is clicked go back to previous page
  const cancelClick = () => {
    history.goBack();
  };

  // useState variable and function
  const [newReservation, setNewReservation] = useState(initialState);

  // submit handler function
  // after submitting should send data to backend
  // also should go back to dashboard with reservations list
  async function submitHandler(evt) {
    try {
      evt.preventDefault();
      const abortController = new AbortController();
      const response = await createReservation(
        { data: newReservation },
        abortController.signal
      );
      history.push(`/dashboard?date=${newReservation.reservation_date}`);
    } catch (error) {
      console.log(error)
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

  // the format of the form
  // styling if possible using bootstrap
  // requires 6 fields first_name,last_name,mobile_number,reservation_date,reservation_time, & people

  return (
    <>
      <fieldset>
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
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-5">
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
            <div className="form-group col-md-5">
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
            <div className="form-group col-md-2">
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
            className="btn btn-light border mr-2"
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
