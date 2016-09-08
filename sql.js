const { postgresURL } = require('./envVariables'),
 pgp = require('pg-promise')();

const db = pgp(postgresURL);

const findItem = (FBID, prodName) => {
  return db.oneOrNone("SELECT item, itemid FROM items WHERE fbid=$1 AND item=$2", [FBID, prodName]);
};

const getMenu = (FBID) => db.many("SELECT item, itemid FROM items WHERE fbid=$1", FBID);

const getLocation = (FBID) => db.one("SELECT location FROM companies WHERE fbid=$1", FBID);

getLocation(1766837970261548)
  .then(data => console.log("data =", data) )
  .catch(err => console.error("ERRONI", err.message || err));

module.exports = {
  findItem,
  getMenu,
  getLocation
};
