/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const express = require('express');
const router = express.Router();

router.param('companyId', (req, res, next, id) => {
  console.log("company id =", id);
  return next();
});

router.get('/:companyId', (req, res) => {
  return res.render('company', { title: req.user.name, me: { name: 'bumbler' } });
});

module.exports = router;
