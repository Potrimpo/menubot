const { postgresURL } = require('./envVariables'),
  path = require('path'),
  pgp = require('pg-promise')();

const db = pgp(postgresURL);

// Create QueryFile globally, once per file:
const findItemQuery = sql('./sqlFiles/findItem.sql'),
  getMenuQuery = sql('./sqlFiles/getMenu.sql'),
  getLocationQuery = sql('./sqlFiles/getLocation.sql'),
  getTypesQuery = sql('./sqlFiles/getTypes.sql'),
  getSizesQuery = sql('./sqlFiles/getSizes.sql'),
  getValsForOrderQuery = sql('./sqlFiles/getValsForOrder.sql'),
  makeOrderQuery = sql('./sqlFiles/makeOrder.sql');

const findItem = (fbPageId, prodName) => db.oneOrNone(findItemQuery, [fbPageId, prodName]),

  getMenu = (fbPageId) => db.many(getMenuQuery, fbPageId),

  getLocation = (fbPageId) => db.one(getLocationQuery, fbPageId),

  getTypes = (itemid) => db.many(getTypesQuery, itemid),

  getSizes = (typeid) => db.many(getSizesQuery, typeid),

  makeOrder = (fbPageId, fbUserId, typeid, sizeid, time) => db.one(makeOrderQuery, [fbPageId, fbUserId, typeid, sizeid, time]);

// getTypes(1)
//   .then(data => console.log("data =", data) )
//   .catch(err => console.error("ERRONI", err.message || err));

function sql(file) {
  return new pgp.QueryFile(path.join(__dirname, file), {minify: true});
}

module.exports = {
  findItem,
  getMenu,
  getLocation,
  getTypes,
  getSizes,
  makeOrder
};
