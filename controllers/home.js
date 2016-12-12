"use strict";

const db = require('../repositories/site/CompanyRepository');

exports.index = (req, res) => {
  const accountIds = req.user.accounts.map(val => val.fbid);
  return db.findUserCompanies(accountIds)
    .then(companies => {
      const accounts = unregisteredCompanies(req.user.accounts, companies);
      return res.render('home', { title: 'home', companies, accounts })
    } );
};

function unregisteredCompanies (accounts, dbCompanies) {
  return accounts.filter(val =>
    dbCompanies.map(comp => comp.fbid)
      .indexOf(val.fbid) === -1
  );
}

exports.landing = (req, res) =>
  req.user && req.isAuthenticated() ? res.redirect('/') :
    res.render('landing', {
      title: 'landing'
    });

exports.login = (req, res) =>
  req.user && req.isAuthenticated() ?
    res.redirect('/') :
    res.render('login', {
      title: 'login'
    });

exports.orders = (req, res) =>
  res.render('orders/orders', {
    title: 'Orders',
    fbid: req.params.fbid
  });

exports.priv = (req,res) =>
  res.render('priv', {
    title: "Privacy Policy"
  });
