const express = require('express');
const router = express.Router();
const chartslModels = require('../models/charts');


function sendJSON(json) {
    return JSON.stringify(json)
}

router.get('/amount', function (req, res, next) {
    const param = req.query;
    chartslModels.getPressure(param).then((mysqlRes, fields) => {
        res.end(sendJSON({
            data: mysqlRes,
            fields: fields,
            status: 'ok'
        }));
    }).catch(err => {
        console.error(err);
        res.end(sendJSON({
            msg: err,
            status: 'error'
        }));
        next();
    });
});


router.get('/trade', function (req, res, next) {
    const param = req.query;
    chartslModels.getTrade(param).then((mysqlRes, fields) => {
        res.end(sendJSON({
            data: mysqlRes,
            fields: fields,
            status: 'ok'
        }));
    }).catch(err => {
        console.error(err);
        res.end(sendJSON({
            msg: err,
            status: 'error'
        }));
        next();
    });
});

router.get('/watchSymbols', function (req, res, next) {
    chartslModels.getWatchSymbols().then((mysqlRes, fields) => {
        res.end(sendJSON({
            data: mysqlRes.map(item => item.symbol),
            fields: fields,
            status: 'ok'
        }));
    }).catch(err => {
        console.error(err);
        res.end(sendJSON({
            msg: err,
            status: 'error'
        }));
        next();
    });
});
module.exports = router;