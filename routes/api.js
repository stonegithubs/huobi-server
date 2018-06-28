var express = require('express');
var url = require('url');
const upgrade = require('../lib/ws-server');
const connect = require('../mysql/connect');

var router = express.Router();


router.get('/api/v1/createDepth', function(req, res, next) {
  res.writeHead(200);
  console.log(2)
  connect.query(`
    CREATE TABLE IF NOT EXISTS HUOBI_DEPTH(
      id INT UNSIGNED AUTO_INCREMENT,
      count INT NOT NULL,
      amount VARCHAR(20) NOT NULL,
      sumCount VARCHAR(20) NOT NULL,
      sumMoneny VARCHAR(20) NOT NULL,
      price VARCHAR(20) NOT NULL,
      prices VARCHAR(40) NOT NULL,
      time DATE,
      PRIMARY KEY ( id )
  )ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `).then((mysqlRes, fields) => {
    // res.end(url.parse(res, true));
    res.end(JSON.stringify(mysqlRes));
    console.log('mysqlRes')
    
    // res.send(JSON.stringify(mysqlRes));
  }).catch(error => {
    console.log(error)
    // res.end('url.parse(res, true)');
    // res.send(JSON.stringify(error));
    res.end();
  }).finally(() => {
    console.log(2.5)
    console.log('next')
    res.end();
    // next();
  })
});

router.post('/api/v1/depth', function(req, res, next) {
  res.writeHead(200);
  let param = {
    count: 1,
    amount : '1',
    sumCount: '1',
    sumMoneny: '1',
    price : '1',
    prices: '1',
    time: new Date(),
  }
  connect.query(`
  INSERT INTO HUOBI_DEPTH SET ?;
  `, param).then((mysqlRes, fields) => {
    // res.end(url.parse(res, true));
    res.end(JSON.stringify(mysqlRes));
    console.log('mysqlRes')
    
    // res.send(JSON.stringify(mysqlRes));
  }).catch(error => {
    console.log(error)
    // res.end('url.parse(res, true)');
    // res.send(JSON.stringify(error));
    res.end();
  }).finally(() => {
    console.log(2.5)
    console.log('next')
    res.end();
    // next();
  })
});
module.exports = router;
