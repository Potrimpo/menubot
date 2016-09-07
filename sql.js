const { postgresURL } = require('./envVariables'),
 pgp = require('pg-promise')();

const db = pgp(postgresURL);

const findItem = (FBID, prodName) => {
  return db.oneOrNone("SELECT item, itemid FROM items WHERE fbid=$1 AND item=$2", [FBID, prodName]);
};

// findItem(1766837970261548, 'sandwiches')
//   .then(data => console.log("data.item =", data.item))
//   .catch(err => console.error("ERRONI", err.message || err));

module.exports = {
  findItem
};
