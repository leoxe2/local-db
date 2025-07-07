const { database } = require('./core/storage');
const { collection } = require('./core/collection');

function create(config) {
  return new database(config);
}

module.exports = {
  database,
  collection,
  create
};
