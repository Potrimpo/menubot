const { postgresURL } = require('./envVariables'),
 pgp = require('pg-promise')();

const db = pgp(postgresURL);

const findItem = (FBID, prodName) => {
  return db.oneOrNone("SELECT item, itemid FROM items WHERE fbid=$1 AND item=$2", [FBID, prodName]);
};

const getMenu = (FBID) => db.many("SELECT item, itemid FROM items WHERE fbid=$1", FBID);

// getMenu(1766837970261548)
//   .then(data => {
//     console.log("data =", data);
//     var x = data.map(val => val.item );
//     console.log("x =", x);
//   })
//   .catch(err => console.error("ERRONI", err.message || err));

module.exports = {
  findItem,
  getMenu
};
