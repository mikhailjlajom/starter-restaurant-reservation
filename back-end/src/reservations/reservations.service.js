const knex = require("../db/connection");

// receives reservation and queries with database
function create(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((createdReservation) => createdReservation[0]);
}

// queries database with date to return all data that matches date
function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

module.exports = {
  create,
  list,
  read,
};
