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
  const { data: { reservation_date } = {} } = req.body;
  if (!dateRegex.test(reservation_date)) {
    return next({ status: 400, message: `reservation_date` });
  }
  next();
}

function reservationTimeIsValid(req, res, next) {
  let timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const { data: { reservation_time } = {} } = req.body;

  if (!timeRegex.test(reservation_time)) {
    return next({ status: 400, message: `reservation_time` });
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

function formatDate(date) {
  let formattedDate = new Date(date).toLocaleString();
  return formattedDate;
}

async function create(req, res) {
  const newReservation = ({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data);

  newReservation["reservation_date"] = formatDate(
    newReservation["reservation_date"]
  );

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
