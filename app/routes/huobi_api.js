var express = require('express');
var url = require('url');

const connect = require('../../mysql/connect');
const hbsdk = require('../../lib/sdk/hbsdk');
const mysqlModel = require('../models/mysql');
var router = express.Router();

const path = '/v1';

function sendJSON(json) {
    return JSON.stringify(json)
}

/**
 * 买单
 */
router.post(path + '/buy_limit', function (req, res, next) {
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
router.post(path + '/limit', function (req, res, next) {
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
router.post(path + '/cancelOrder', function (req, res, next) {
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
router.get(path + '/openOrders', function (req, res, next) {
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
});

/**
 * 查余额
 */
router.get(path + '/get_balance', function (req, res, next) {
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
router.get(path + '/get_order', function (req, res, next) {
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
router.get(path + '/get_kline', function (req, res, next) {
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

/**
 * 获取深度
 */
router.get(path + '/market/depth', function (req, res, next) {
    let params = req.query;
    hbsdk.getDepth(params).then((data) => {
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
