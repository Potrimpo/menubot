"use strict";

/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  console.log("req.session =", req.session);
  res.render('home', {
    title: 'Home'
  });
};