const express = require('express');
const router = express.Router();

const huobi_api = require('./huobi_api');
const chart_api = require('./chart_api');
const diff_api = require('./diff_api');

router.use('/huobi', huobi_api);
router.use('/chart', chart_api);
router.use('/diff', diff_api);

module.exports = router;