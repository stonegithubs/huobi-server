
const WS_HUOBI = require('../../lib/ws-huobi');
// const WS_BINANCE = require('../../lib/ws-binance');
const hbsdk = require('../../lib/sdk/hbsdk');
const huobiSymbols = require('../utils/huobiSymbols');
const { getWatchSymbols } = require('../models/charts');
const AbnormalMonitor = require('../utils/AbnormalMonitor');
const { initTable } = require('../models/mysql');
const { getAllDetail } = require('./difference');

let symbols = [];
// const priceKline = new AbnormalMonitor({config: {range: 0.03, disTime: 0, recordMaxLen: 300}});
// const amountKline = new AbnormalMonitor({config: {range: 6, disTime: 0, recordMaxLen: 300}});
// hbsdk.getKline({
//     symbol: 'bchusdt',
//     period: '30min',
//     size: 300,
// }).then((data) => {
//     data.reverse().forEach((item) => {
//         priceKline.speed({
//             value: item.close,
//             ts: new Date(Number(item.id + '000')).getTime(),
//         });
//         amountKline.speed({
//             value: (item.vol / appConfig.prices.btc).toFixed(2),
//             ts: new Date(Number(item.id + '000')).getTime(),
//         });
//     });
//     console.log(data, priceKline, amountKline)
// }).catch(console.error)
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
    getAllDetail();
    // await WS_BINANCE.open();
}
exports.start = start;


