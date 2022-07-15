/**
 * List handler for reservation resources
 */

const service = require("./reservations.service")
async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  list,
};
