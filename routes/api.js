var express = require('express');
var url = require('url');
const upgrade = require('../lib/ws-server');
const connect = require('../mysql/connect');

var router = express.Router();


router.get('/api/v1/a', function(req, res, next) {
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(url.parse(req.url, true));
  // connect.query('SELECT 1 + 1 AS solution').then((res, fields) => {
  //   console.log(res)
  // })
  next();
});
module.exports = router;
