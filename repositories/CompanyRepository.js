/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const { Company } = require('../database/models/index');

exports.findUserCompanies = (accounts => {
  return Company.findAll({
    attributes: ['fbid', 'name'],
    where: { fbid: { $or: accounts } }
  })
});

