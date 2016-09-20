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

exports.getCompanyAndItems = id => {
  return sequelize.query(
    "SELECT name, location, item, items.itemid, type, typeid FROM companies" +
    " INNER JOIN items ON companies.fbid = items.fbid" +
    " INNER JOIN types ON items.itemid = types.itemid" +
    " WHERE companies.fbid = $1",
    { bind: [id], type: sequelize.QueryTypes.SELECT }
  );
};

