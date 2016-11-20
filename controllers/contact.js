"use strict";

exports.getContact = function(req, res) {
  res.render('contact', {
    title: 'Contact'
  });
};
