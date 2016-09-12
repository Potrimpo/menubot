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
  makeOrderQuery = sql('./sqlFiles/makeOrder.sql'),
  orderDetailsQuery = sql('./sqlFiles/orderDetails.sql');

const findItem = (fbPageId, prodName) => db.oneOrNone(findItemQuery, [fbPageId, prodName]),

  getMenu = (fbPageId) => db.many(getMenuQuery, fbPageId),

  getLocation = (fbPageId) => db.one(getLocationQuery, fbPageId),

  getTypes = (itemid) => db.many(getTypesQuery, itemid),

  getSizes = (typeid) => db.many(getSizesQuery, typeid),

  makeOrder = (fbPageId, fbUserId, typeid, sizeid, time) => {
    return db.one(makeOrderQuery, [fbPageId, fbUserId, typeid, sizeid, time]);
  },

  orderDetails = (sizeid) => db.one(orderDetailsQuery, sizeid),

  findOrder = (fbPageId, fbUserId, sizeid) => {
    return db.one("SELECT * FROM orders WHERE fbid=$1 AND userid=$2 AND sizeid=$3", [fbPageId, fbUserId, sizeid]);
  };

function sql(file) {
  return new pgp.QueryFile(path.join(__dirname, file), {minify: true});
}

module.exports = {
  findItem,
  getMenu,
  getLocation,
  getTypes,
  getSizes,
  makeOrder,
  orderDetails,
  findOrder
};
