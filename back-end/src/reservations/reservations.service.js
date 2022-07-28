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
    .andWhereNot({status: "finished"})
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function updateStatus(updatedReservation){
  return knex("reservations").select("*").where({reservation_id: updatedReservation.reservation_id}).update({status: updatedReservation.status}, "*").then((updatedRecords) => updatedRecords[0])
}


function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  create,
  list,
  read,
  updateStatus,
  search
};
