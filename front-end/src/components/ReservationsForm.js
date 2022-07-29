import React from "react"


// the form component to be used be createreservation and editreservation
function ReservationsForm({changeHandler, submitHandler, reservation, cancelClick}){
return (
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
                value={reservation.first_name}
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
                value={reservation.last_name}
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
                value={reservation.mobile_number}
                maxLength="12"
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
                value={reservation.reservation_date}
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
                value={reservation.reservation_time}
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
                value={reservation.people}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelClick}
          ><span className="oi oi-x"></span>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
          <span className="oi oi-check"></span> 
             Submit
          </button>
        </form>
)
}

export default ReservationsForm