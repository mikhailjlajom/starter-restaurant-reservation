const knex = require("../db/connection");

function create(table) {
  return knex("tables")
    .insert(table, "*")
    .then((createdTable) => createdTable[0]);
}

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function readReservation(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function update(updatedTable) {
  return knex("tables as t").where({ table_id: updatedTable.table_id }).update(updatedTable)
}

module.exports = {
  create,
  list,
  read,
  update,
  readReservation,
};
