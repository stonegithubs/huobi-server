const WS_HUOBI = require('../../lib/ws-huobi');
const hbsdk = require('../../lib/sdk/hbsdk');
const getSameAmount = require('../utils/getSameAmount');
// 单位为usdt
global.ethPrice = 466;
global.btcPrice = 8000;

let symbols = 'btcusdt';
let quoteCurrency = '$';
let symbol = {
    quote: 'usdt',
    base: 'btc'
}
async function start() {

    // 查最新的价格
    await hbsdk.getKline({
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

    let precisionData = await hbsdk.getSymbols();
    let pricePrecision = 0;
    let amountPrecision = 0;
    precisionData.some((item) => {
        // base-currency:"yee"
        // price-precision:8
        // quote-currency:"eth"
        if (item['base-currency'] === symbol.base && item['quote-currency'] === symbol.quote) {
            pricePrecision = item['price-precision'];
            amountPrecision = item['amount-precision'];
            return true;
        }
        return false;
    });

    await WS_HUOBI.open().then(function () {
        // 开始订阅
        WS_HUOBI.call({
            type: `ws-huobi`,
            value: 'subscribeDepth',
            symbol: `${symbols}`
        });
        WS_HUOBI.call({
            type: `ws-huobi`,
            value: 'subscribeTrade',
            symbol: `${symbols}`
        });
        getSameAmount.setConfig({
            pricePrecision,
            amountPrecision,
            quoteCurrency: symbol.quote
        })
    });
}
exports.start = start;


