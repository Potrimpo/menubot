"use strict";

const companyRepo = require('../repositories/site/CompanyRepository');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  const accountIds = req.user.accounts.map(val => val.fbid);
  return companyRepo.findUserCompanies(accountIds)
    .then(companies => {
      const accounts = unregisteredCompanies(req.user.accounts, companies);
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

exports.orders = (req, res) => {
  console.log("fbid for order page =", req.params.fbid);
  return res.render('orders/orders', { title: 'Orders', fbid: req.params.fbid });
};
