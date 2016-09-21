/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const { sequelize, Company, Item } = require('../database/models/index');

exports.findUserCompanies = (accounts => {
  return Company.findAll({
    attributes: ['fbid', 'name'],
    where: { fbid: { $or: accounts } }
  })
});

exports.getCompanyMenu = id => {
  return sequelize.query(
    "SELECT name, item, itemid FROM companies" +
    " INNER JOIN items ON companies.fbid = items.fbid" +
    " WHERE companies.fbid = $1",
    { bind: [id], type: sequelize.QueryTypes.SELECT }
  );
};

exports.getMenuTypes = itemids => {
  return sequelize.query(
    "SELECT types.itemid, type, typeid FROM items" +
    " INNER JOIN types ON items.itemid = types.itemid" +
    " WHERE items.itemid IN (:itemids)",
    { replacements: { itemids }, type: sequelize.QueryTypes.SELECT }
  );
};

exports.getMenuSizes = typeids => {
  return sequelize.query(
    "SELECT sizes.typeid, size, sizeid, price FROM types" +
    " INNER JOIN sizes ON types.typeid = sizes.typeid" +
    " WHERE types.typeid IN (:typeids)",
    { replacements: { typeids }, type: sequelize.QueryTypes.SELECT }
  );
};