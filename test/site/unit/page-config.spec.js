process.env.postgresPassword = "45FeistyEggsFearY2k";
process.env.postgresURL = "localhost";

const expect = require('chai').expect,
  R = require('ramda'),
  { sequelize } = require('../../../database/models/index'),
  companyRepo = require('../../../repositories/site/CompanyRepository'),
  db = require('../db-site-test-calls'),
  dev = require('../../../config/local-dev-variables');

const tz = 'Auckland/Pacific';

describe('configuring a page for the bot:', function () {

  before(function () {
    return sequelize.sync()
      .then(_ =>
        db.deleteCompany(dev.testPageID));
  });

  it('create company in db from fb page', function () {
    return db.getUserByFbid(dev.companyOwnerID)
      .then(user => {
        return companyRepo.linkCompany(user.id, dev.testPageID, tz)
      })
      .then(res => {
        const fbid = R.prop('fbid', R.head(res));
        expect(fbid).to.equal(dev.testPageID);
      })
      .then(() =>
        companyRepo.findUserCompanies([dev.testPageID]))
      .then(companies => {
        const fbids = R.pluck('fbid', companies);

        expect(companies).to.be.an('array');
        expect(fbids).to.contain(dev.testPageID);
      });
  });

});
