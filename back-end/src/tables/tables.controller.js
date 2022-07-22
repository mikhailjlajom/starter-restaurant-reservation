const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

// validation needed for data

async function validateTable(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: "Data missing!" });
  const { table_name, capacity } = req.body.data;

  if (!table_name || !capacity) {
    return next({
      status: 400,
      message: "Please complete the following: table_name, and capacity.",
    });
  }

  if (table_name.length === 1) {
    return next({ status: 400, message: "Please complete: table_name." });
  }

  if (capacity === 0 || typeof capacity !== "number") {
    return next({ status: 400, message: "Please complete: capacity." });
  }
  next();
}

function validateData(req,res,next){
  const {data} = req.body
  if(!data){
    return next({status: 400, message: `Data is missing`})
  }
  if(!data.reservation_id) {
    return next({status: 400, message: `reservation_id`})
  }
  next()
}

// validate if table exists
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 400, message: `Table with ${table_id} does not exist.` });
}

// validate if reservation exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await service.readReservation(reservation_id);
  
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation with ${reservation_id} does not exist.`,
  });
}

// validate capacity for table if can accommodate reservation people
function validateCapacityAndAvailability(req,res,next) {
  let reservation = res.locals.reservation;
  let table = res.locals.table;


  if (table.reservation_id) {
    next({ status: 400, message: `Table ${table.table_id} is occupied.` });
  }

  if (table.capacity < reservation.people) {
    next({
      status: 400,
      message: `Table does not have enough capacity. Seating for ${reservation.people} needed.`,
    });
  }
  return next();
}

// function that lists the table
async function list(req, res) {
  const listedTables = await service.list();
  res.json({
    data: listedTables,
  });
}

// function creates the table to be sent to the database
async function create(req, res) {
  const newTable = ({ table_name, capacity } = req.body.data);

  const createdTable = await service.create(newTable);

  res.status(201).json({ data: createdTable });
}

// function updates the table that matches table_id, with reservation_id
async function update(req, res, next) {
  let table = res.locals.table;
  let reservation = res.locals.reservation

  const updatedTable = {
    ...table,
    reservation_id: reservation.reservation_id,
  };

  const data = await service.update(updatedTable);
  res.json({ data });
}

module.exports = {
  list: [list],
  create: [asyncErrorBoundary(validateTable), asyncErrorBoundary(create)],
  update: [
    validateData,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    validateCapacityAndAvailability,
    asyncErrorBoundary(update),
  ],
};
