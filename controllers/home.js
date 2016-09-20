"use strict";

const userRepo = require('../repositories/UserRepository');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  if (!req.user) return res.redirect('/landing');
  return userRepo.findUserCompanies(req.user.accounts)
    .then(data => res.render('home', { title: 'home', companies: data }) );
};

exports.landing = (req, res) => {
  res.render('landing', {
    title: 'landing'
  });
};