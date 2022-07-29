import React, { useEffect, useState } from "react";
import { readReservation, updateReservation } from "../utils/api";
import { useHistory, useParams } from "react-router";
import ReservationsForm from "./ReservationsForm";
import ErrorAlert from "../layout/ErrorAlert";


function EditReservation() {
  const { reservation_id } = useParams();
 
  const [error, setError] = useState(null);
  let history = useHistory();

  let initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
    status: "",
  };

  const [reservation, setReservation] = useState(initialState);

  useEffect(loadSeatReservation, [reservation_id]);

  function loadSeatReservation() {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setError);
    return () => abortController.abort();
  }

  const cancelClick = () => {
    history.goBack();
  };

  function changeHandler(evt) {
    const resKey = evt.target.name;
    let resValue = evt.target.value;
    if (resKey === "people" && resValue) {
      resValue = parseInt(resValue);
    }
    setReservation({
      ...reservation,
      [resKey]: resValue,
    });
  }

  async function submitEditHandler(evt) {
    evt.preventDefault();
    try {
      const abortController = new AbortController();
      reservation["reservation_date"] = reservation.reservation_date.split("T")[0]
      await updateReservation(reservation, abortController.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`)
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div>
      <h1>Edit Reservation</h1>
      <ErrorAlert error={error}/>
      <ReservationsForm
        reservation={reservation}
        changeHandler={changeHandler}
        submitHandler={submitEditHandler}
        cancelClick={cancelClick}
      />
    </div>
  );
}

export default EditReservation;
