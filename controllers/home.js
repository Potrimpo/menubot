"use strict";

const companyRepo = require('../repositories/CompanyRepository');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  console.log("PROBLEM WITH FINDUSERCOMPANIES");
  const accountIds = req.user.accounts.map(val => val.fbid);
  console.log("accounts =", accountIds);
  return companyRepo.findUserCompanies(accountIds)
    .then(companies => {
      console.log("companies", companies.map(val => val.fbid));
      const accounts = unregisteredCompanies(req.user.accounts, companies);
      console.log("NONREGISTERED ACCOUNTS", accounts);
      return res.render('home', { title: 'home', companies, accounts })
    } );
};

exports.landing = (req, res) => {
  if (req.user && req.isAuthenticated()) return res.redirect('/');
  res.render('landing', {
    title: 'landing'
  });
};

function unregisteredCompanies (accounts, dbCompanies) {
  return accounts.filter(val => {
    for (let i = dbCompanies.length - 1; i >= 0; i--) {
      if (dbCompanies[i].fbid === val.fbid) return false
    }
    return true;
  })
}