const express = require('express');
const api = require('./api');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  api(req, res);
  next();
});
module.exports = router;
