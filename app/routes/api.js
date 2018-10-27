const express = require('express');
const router = express.Router();

const huobi_api = require('./huobi_api');
const chart_api = require('./chart_api');

router.use('/huobi', huobi_api);
router.use('/chart', chart_api);

function sendJSON(json) {
    return JSON.stringify(json)
}


module.exports = router;