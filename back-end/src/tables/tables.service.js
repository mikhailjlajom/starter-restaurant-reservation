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
  return knex.transaction(async (trx) => {
    const tableAndRes = await knex("reservations")
      .where({ reservation_id: updatedTable.reservation_id })
      .update({ status: "seated" })
      .returning("*")
      .then((updatedRecords) => updatedRecords[0]);
    await knex("tables")
      .where({ table_id: updatedTable.table_id })
      .update(updatedTable)
      .returning("*")
      .then((updatedRecords) => updatedRecords[0]);
    return tableAndRes;
  });
}

function removeResIdStatFinish(updatedTable, res_id) {
  return knex.transaction(async (trx) => {
    const tableAndRes = await knex("reservations")
      .where({ reservation_id: res_id })
      .update({ status: "finished" })
      .returning("*")
      .then((updatedRecords) => updatedRecords[0]);
    await knex("tables")
      .where({ table_id: updatedTable.table_id })
      .update(updatedTable)
      .returning("*")
      .then((updatedRecords) => updatedRecords[0]);
    return tableAndRes;
  });
}

module.exports = {
  create,
  list,
  read,
  update,
  readReservation,
  removeResIdStatFinish
};
