
const AbnormalMonitor = require('../utils/AbnormalMonitor');
const hbsdk = require('../../lib/sdk/hbsdk');
const appConfig = require('../config');

let pRange = 0.03;
let aRage = 6;
let heng = 0;
const priceKline = new AbnormalMonitor({config: {range: pRange, disTime: 0, recordMaxLen: 300}});
const amountKline = new AbnormalMonitor({config: {range: aRage, disTime: 0, recordMaxLen: 300}});


function train() {
    hbsdk.getKline({
        symbol: 'paiusdt',
        period: '30min',
        size: 300,
    }).then((data) => {
        data.reverse().forEach((item) => {
            priceKline.speed({
                value: item.close,
                ts: new Date(Number(item.id + '000')).getTime(),
            });
            amountKline.speed({
                value: (item.vol / appConfig.prices.btc).toFixed(2),
                ts: new Date(Number(item.id + '000')).getTime(),
            });
        });
        console.log(data, priceKline, amountKline)
    }).catch(console.error)
}
module.exports = train;