var express = require('express');
var url = require('url');
const upgrade = require('../lib/ws-server');
const connect = require('../mysql/connect');

var router = express.Router();

function sendJSON(json) {
  return JSON.stringify(json)
}
router.get('/api/v1/showTables', function(req, res, next) {
  let param = req.query;
  connect.query(`SHOW TABLES`).then((mysqlRes, fields) => {
    res.end(sendJSON({
      data: mysqlRes,
      fields: fields,
      status: 'ok'
    }));
  }).catch(error => {
    next(error);
  })
});

router.post('/api/v1/createTable', function(req, res, next) {
  let param = req.body;
  connect.query(`
    CREATE TABLE IF NOT EXISTS ${param.tableName}(
      id INT UNSIGNED AUTO_INCREMENT,
      symbol VARCHAR(20) NOT NULL,
      time DATETIME,
      asksList VARCHAR(10000) NOT NULL,
      bidsList VARCHAR(10000) NOT NULL,
      PRIMARY KEY ( id )
  )ENGINE=InnoDB DEFAULT CHARSET=utf8;
  `).then((mysqlRes, fields) => {
    res.end(JSON.stringify({
      data: mysqlRes,
      fields: fields,
      status: 'ok'
    }));
  }).catch((err) => {
    console.log(err);
    next(err);
  })
});
router.post('/api/v1/delTable', function(req, res, next) {
  let param = req.body;
  connect.query(`DROP TABLE ${param.tableName}`).then((mysqlRes, fields) => {
    res.end(JSON.stringify({
      data: mysqlRes,
      fields: fields,
      status: 'ok'
    }));
  }).catch(next)
});
router.post('/api/v1/depth', function(req, res, next) {
  let params = req.body;
  let param = {
    symbol: params.symbol,
    time: new Date(),
    asksList: JSON.stringify(params.asksList),
    bidsList: JSON.stringify(params.bidsList),
  }
  // let param = {
  //   symbol: '1.symbol',
  //   time: new Date(),
  //   asksList: JSON.stringify([]),
  //   bidsList: JSON.stringify([]),
  // }

  connect.query(`
  INSERT INTO HUOBI_DEPTH SET ?;
  `, param).then((mysqlRes, fields) => {
    console.log(fields)
    res.end(JSON.stringify(mysqlRes));
  }).catch((err) => {
    console.log(err)
    next(err)
  })
});

router.get('/api/v1/select', function(req, res, next) {
  let params = req.query;

  connect.query(`
  SELECT * FROM ${params.tableName};
  `).then((mysqlRes, fields) => {
    res.end(JSON.stringify(mysqlRes));
  }).catch((err) => {
    console.log(err)
    next(err)
  })
});
module.exports = router;
