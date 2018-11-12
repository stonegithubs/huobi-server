const express = require('express');
const router = express.Router();
const difflModels = require('../models/diff');
const huobiSymbols = require('../utils/huobiSymbols');
const appConfig = require('../config');
const diffControllers = require('../controllers/difference');
function sendJSON(json) {
    return JSON.stringify(json)
}


function filterSymbols() {
    return huobiSymbols.getSymbols().then((data) => {
        let list = data.filter(item => !appConfig.watchSymbols.includes(item.symbol));
        return list;
    })
}

router.get('/characteristic', function (req, res, next) {
    const param = req.query;
    if (param.symbol === 'all') {
        res.end(sendJSON({
            data: diffControllers.cache,
            status: 'ok'
        }));
        return;
    }
    chartslModels.getCharacteristic(param).then((mysqlRes, fields) => {
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


router.get('/diffSymbols', function (req, res, next) {
    const param = req.query;
    huobiSymbols.getSymbols().then((data) => {
        let list = data.filter(item => !appConfig.watchSymbols.includes(item.symbol));
        res.end(sendJSON({
            data: list,
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