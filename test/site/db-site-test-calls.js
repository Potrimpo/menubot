const { Company, User } = require('../../database/models/index');

const deleteCompany = fbid =>
  Company.destroy({
    where: { fbid }
  });

const getUserByFbid = fbid =>
  User.findOne({
    where: { facebookId: fbid }
  });

module.exports = {
  deleteCompany,
  getUserByFbid
};
