"use strict";

const companyRepo = require('../repositories/CompanyRepository');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  return companyRepo.findUserCompanies(req.user.accounts)
    .then(data => res.render('home', { title: 'home', companies: data }) );
};

exports.landing = (req, res) => {
  if (req.user && req.isAuthenticated()) return res.redirect('/');
  res.render('landing', {
    title: 'landing'
  });
};