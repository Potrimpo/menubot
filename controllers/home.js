"use strict";

const db = require('../repositories/site/CompanyRepository');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  const accountIds = req.user.accounts.map(val => val.fbid);
  return db.findUserCompanies(accountIds)
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

exports.orders = (req, res) =>
  db.findCompany(req.params.fbid)
    .then(company =>
        res.render('orders/orders', {
          title: 'Orders',
          fbid: req.params.fbid,
          compName: company.name
        })
    );

exports.priv = (req,res) =>
  res.render('priv', {
    title: "Privacy Policy"
  });
