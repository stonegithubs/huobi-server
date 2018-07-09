var express = require('express');
var url = require('url');
const upgrade = require('../lib/ws-server');
const connect = require('../mysql/connect');
const hbsdk = require('../lib/sdk/hbsdk');
var router = express.Router();

function sendJSON(json) {
    return JSON.stringify(json)
}
router.get('/api/v1/showTables', function (req, res, next) {
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

router.post('/api/v1/createTable', function (req, res, next) {
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
router.post('/api/v1/delTable', function (req, res, next) {
    let param = req.body;
    connect.query(`DROP TABLE ${param.tableName}`).then((mysqlRes, fields) => {
        res.end(JSON.stringify({
            data: mysqlRes,
            fields: fields,
            status: 'ok'
        }));
    }).catch(next)
});
router.post('/api/v1/depth', function (req, res, next) {
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
            res.end(JSON.stringify(mysqlRes));
        }).catch((err) => {
            console.log(err)
            next(err)
        })
});

router.get('/api/v1/select', function (req, res, next) {
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

/**
 * 买单
 */
router.post('/api/v1/buy_limit', function (req, res, next) {
    let params = req.body;
    hbsdk.buy_limit(params).then((data) => {
        res.end(JSON.stringify({
            data: data,
            status: 'ok'
        }));
    }).catch(err => {
        res.end(JSON.stringify(err));
    })
});

/**
 * 买卖单
 */
router.post('/api/v1/limit', function (req, res, next) {
    let params = req.body;
    let action = params.action + '_limit';
    if (action !== 'buy_limit' && action !== 'sell_limit') {
        res.end(JSON.stringify({
            data: 'action must eq "buy" | "sell"',
            status: 'error'
        }));
    }
    console.log(action)
    hbsdk[action](params).then((data) => {
        res.end(JSON.stringify({
            data: data,
            status: 'ok'
        }));
    }).catch(err => {
        res.end(JSON.stringify(err));
    })
});

/**
 * 取消订单
 */
router.post('/api/v1/cancelOrder', function (req, res, next) {
    let params = req.body;
    hbsdk.cancelOrder(params.orderId).then((data) => {
        res.end(JSON.stringify({
            data: data,
            status: 'ok'
        }));
    }).catch(err => {
        console.log(err);
        res.end(JSON.stringify(err));
    })
});

/**
 * 查询未成交的订单
 */
router.get('/api/v1/openOrders', function (req, res, next) {
    let params = req.query;
    
    hbsdk.get_open_orders(params.symbol).then((data) => {
        res.end(JSON.stringify({
            data: data,
            status: 'ok'
        }));
    }).catch(err => {
        console.log(err);
        res.end(JSON.stringify(err));
    })
    // hbsdk.getOpenOrders(params).then((data) => {
    //     res.end(JSON.stringify({
    //         data: data,
    //         status: 'ok'
    //     }));
    // }).catch(err => {
    //     console.log(err);
    //     res.end(JSON.stringify(err));
    // })
});

/**
 * 查余额
 */
router.get('/api/v1/get_balance', function (req, res, next) {
    let params = req.query;
    hbsdk.get_balance().then((data) => {
        res.end(JSON.stringify({
            data: data,
            status: 'ok'
        }));
    }).catch(err => {
        console.log(err);
        res.end(JSON.stringify(err));
    })
});
/**
 * 检查订单
 */
router.get('/api/v1/get_order', function (req, res, next) {
    let params = req.query;
    
    hbsdk.get_order(params.orderId).then((data) => {
        res.end(JSON.stringify({
            data: data,
            status: 'ok'
        }));
    }).catch(err => {
        console.log(err);
        res.end(JSON.stringify(err));
    })
});


/**
 * 获取k线
 */
router.get('/api/v1/get_kline', function (req, res, next) {
    let params = req.query;
    hbsdk.getKline(params).then((data) => {
        res.end(JSON.stringify({
            data: data,
            status: 'ok'
        }));
    }).catch(err => {
        console.log(err);
        res.end(JSON.stringify(err));
    })
});
module.exports = router;
