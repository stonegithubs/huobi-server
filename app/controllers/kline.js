
const AbnormalMonitor = require('../utils/AbnormalMonitor');
const hbsdk = require('../../lib/sdk/hbsdk');
const appConfig = require('../config');

let pRange = 0.024;
let aRage = 2.49;
let heng = 0;
const priceKline = new AbnormalMonitor({config: {range: pRange, disTime: 0, recordMaxLen: 300}});
const amountKline = new AbnormalMonitor({config: {range: aRage, disTime: 0, recordMaxLen: 300}});


function train() {
    hbsdk.getKline({
        symbol: 'bchusdt',
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
            if (priceKline.historyStatus.length < 2) {
                return;
            }
            let preLast1 = priceKline.historyStatus[priceKline.historyStatus.length - 2];
            let preLast2 = amountKline.historyStatus[amountKline.historyStatus.length - 2];

            let last1 = priceKline.historyStatus[priceKline.historyStatus.length - 1];
            let last2 = amountKline.historyStatus[amountKline.historyStatus.length - 1];
            // console.log()
            if (preLast2.status === '涨') {
                if (preLast1.status === '涨') {
                    console.log('卖', new Date(Number(item.id + '000')), (item.close * 1.01).toFixed(1));
                }
                if (preLast1.status === '跌') {
                    console.log('买', new Date(Number(item.id + '000')), (item.close * (1 - 0.02)).toFixed(1));
                }
            }
           
        });
        console.log(data, priceKline, amountKline)
    }).catch(console.error)
}
module.exports = train;