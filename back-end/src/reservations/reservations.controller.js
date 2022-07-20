/**
 * List handler for reservation resources
 */

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

// list reservations based on date query

// try to convert time to utc or epoch time
async function list(req, res) {
  let date = req.query.date;
  let isoDate = new Date(date).toISOString();

  const data = await service.list(isoDate);

  res.json({ data });
}

// validation middleware

async function validateReservation(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: "Data Missing!" });
  const {
    first_name,
    last_name,
    mobile_number,
    people,
    reservation_date,
    reservation_time,
    // status,
  } = req.body.data;
  // let updatedStatus = status;
  if (
    !first_name ||
    !last_name ||
    !mobile_number ||
    !people ||
    !reservation_date ||
    !reservation_time
  )
    return next({
      status: 400,
      message:
        "Please complete the following: first_name, last_name, mobile_number, people, reservation_date, and reservation_time.",
    });
  next();
}

function reservationDateIsValid(req, res, next) {
  let dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  let date = new Date();

  const resDate = new Date(reservation_date);

  let todaysDay = resDate.getUTCDay();
  let hours = parseInt(reservation_time.slice(0, 2));
  let mins = parseInt(reservation_time.slice(3));
  let resDateTime = new Date(resDate.setHours(hours + 1, mins));


  if (!dateRegex.test(reservation_date)) {
    next({ status: 400, message: `reservation_date` });
  }
  if (resDateTime < date) {
    next({ status: 400, message: `future` });
  }
  if (todaysDay === 2) {
    next({ status: 400, message: `closed` });
  }
  next();
}

// does validate the reservation time
// same validation as front end

function reservationTimeIsValid(req, res, next) {
  let timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const { data: { reservation_time } = {} } = req.body;

  let reservationHours = parseInt(reservation_time.slice(0, 2));
  let reservationMins = parseInt(reservation_time.slice(3));

  // checks if time is proper format
  if (!timeRegex.test(reservation_time)) {
    return next({ status: 400, message: `reservation_time` });
  }

  // checks if reservation time is on or before 10:30am
  if (reservationHours <= 10 && reservationMins <= 30) {
    return next({ status: 400, message: `something with time` });
  }

  // checks if reservation time is from 9:30pm-10:30pm
  if (
    (reservationHours === 21 && reservationMins >= 30) ||
    (reservationHours === 22 && reservationMins <= 30)
  ) {
    return next({ status: 400, message: `something with time` });
  }

  // checks if reservation time is from 10:31pm onwards
  if (
    (reservationHours === 22 && reservationMins > 30) ||
    reservationHours >= 23
  ) {
    return next({ status: 400, message: `something with time` });
  }
  next();
}

function peopleIsValid(req, res, next) {
  const { data: { people } = {} } = req.body;
  console.log("checking people", typeof people);
  if (typeof people !== "number") {
    return next({ status: 400, message: `people` });
  }
  next();
}

// create function that will interact with service file
// will do a post method
// can either send date as iso format or receive date from database in iso

async function create(req, res) {
  const newReservation = ({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data);

  const createdReservation = await service.create(newReservation);

  res.status(201).json({ data: createdReservation });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    validateReservation,
    reservationDateIsValid,
    reservationTimeIsValid,
    peopleIsValid,
    asyncErrorBoundary(create),
  ],
};
