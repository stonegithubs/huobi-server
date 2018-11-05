const WS_HUOBI = require('../../lib/ws-huobi');
const WS_BINANCE = require('../../lib/ws-binance');
const hbsdk = require('../../lib/sdk/hbsdk');
const huobiSymbols = require('../utils/huobiSymbols');
// 单位为usdt
global.ethPrice = 200;
global.btcPrice = 6480;

const symbols = ['btcusdt', 'htusdt', 'bchusdt'];
const symbol = {
    quote: 'usdt',
    base: 'btc'
}

async function start() {

    // 查最新的价格
    hbsdk.getKline({
        symbol: 'btcusdt',
        period: '5min',
    }).then((data) => {
        global.btcPrice = data[1].close;
    }).catch(console);

    await hbsdk.getKline({
        symbol: 'ethusdt',
        period: '5min',
    }).then((data) => {
        global.ethPrice = data[1].close;
    }).catch(console);
    // 先取小数位
    await huobiSymbols.getSymbols();

    await WS_HUOBI.open().then(function () {
        symbols.forEach((symbol) => {
            // 开始订阅
            WS_HUOBI.call({
                type: `ws-huobi`,
                value: 'subscribeDepth',
                symbol: `${symbol}`,
                from: 'server'
            });
            WS_HUOBI.call({
                type: `ws-huobi`,
                value: 'subscribeTrade',
                symbol: `${symbol}`,
                from: 'server'
            });
            WS_HUOBI.call({
                type: `ws-huobi`,
                value: 'subscribeKline',
                symbol: `${symbol}`,
                from: 'server'
            });
        });
    });
    // await WS_BINANCE.open();
}
exports.start = start;


