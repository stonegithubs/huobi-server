
const WS_HUOBI = require('../../lib/ws-huobi');
// const WS_BINANCE = require('../../lib/ws-binance');
const hbsdk = require('../../lib/sdk/hbsdk');
const huobiSymbols = require('../utils/huobiSymbols');
const { getWatchSymbols } = require('../models/charts');
const { initTable } = require('../models/mysql');

let symbols = [];

async function start() {
    await initTable();
    await Promise.all([
        // 查最新的价格
        hbsdk.getKline({
            symbol: 'btcusdt',
            period: '5min',
        }).then((data) => {
            appConfig.prices.btc = data[1].close;
        }).catch(console.error)
        ,
        hbsdk.getKline({
            symbol: 'ethusdt',
            period: '5min',
        }).then((data) => {
            appConfig.prices.eth = data[1].close;
        }).catch(console.error)
        ,
        // 获取全部交易对的精度
        huobiSymbols.getSymbols()
        ,
        getWatchSymbols().then(mysqlRes => {
            symbols = mysqlRes.map(item => item.symbol);
        })
    ]);
    await WS_HUOBI.open().then(function () {
        symbols.forEach((symbol) => {
            // 开始订阅
            WS_HUOBI.subscribe.sub(WS_HUOBI, {
                type: `sub`,
                value: `market.${symbol}.depth.step0`,
                symbol: `${symbol}`,
                from: 'server'
            });
            WS_HUOBI.subscribe.sub(WS_HUOBI, {
                type: `sub`,
                value: `market.${symbol}.trade.detail`,
                symbol: `${symbol}`,
                from: 'server'
            });
            WS_HUOBI.subscribe.sub(WS_HUOBI, {
                type: `sub`,
                value:  `market.${symbol}.kline.1min`,
                symbol: `${symbol}`,
                from: 'server'
            });
        });
    });
    // await WS_BINANCE.open();
}
exports.start = start;


