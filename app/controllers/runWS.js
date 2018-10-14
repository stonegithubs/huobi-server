const WS_HUOBI = require('../../lib/ws-huobi');
const hbsdk = require('../../lib/sdk/hbsdk');

// 单位为usdt
global.ethPrice = 466;
global.btcPrice = 8000;
// 查最新的价格
hbsdk.getKline({
    symbol: 'btcusdt',
    period: '5min',
}).then((data) => {
    global.btcPrice = data[1].close;
}).catch(log);

hbsdk.getKline({
    symbol: 'ethusdt',
    period: '5min',
}).then((data) => {
    global.ethPrice = data[1].close;
}).catch(log);

WS_HUOBI.open().then(function () {
    WS_HUOBI.call(msg);
});
