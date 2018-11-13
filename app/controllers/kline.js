
const AbnormalMonitor = require('../utils/AbnormalMonitor');
const hbsdk = require('../../lib/sdk/hbsdk');
const { CalculateMA } = require('../utils/calculateMA');
const appConfig = require('../config');

let pRange = 0.024;
let aRage = 2.49;
let heng = 0;
let dataCount = 300;
const priceKline = new AbnormalMonitor({config: {range: pRange, disTime: 0, recordMaxLen: dataCount}});
const amountKline = new AbnormalMonitor({config: {range: aRage, disTime: 0, recordMaxLen: dataCount}});


function train() {
    hbsdk.getKline({
        symbol: 'bchusdt',
        period: '30min',
        size: dataCount,
    }).then((data) => {
        let MA5 = new CalculateMA(5);
        let MA30 = new CalculateMA(30);
        let MA60 = new CalculateMA(60);
        let rData = data.reverse();
        rData.forEach((item, index) => {
            MA5.push(rData, index);
            MA30.push(rData, index);
            MA60.push(rData, index);
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
                if (preLast1.status === '涨' || item.close > MA60.last()) {
                    console.log('卖', new Date(Number(item.id + '000')), (item.close * 1.01).toFixed(1));
                }
                if (preLast1.status === '跌' && item.close < MA5.last()) {
                    console.log('买', new Date(Number(item.id + '000')), (item.close * (1 - 0.02)).toFixed(1));
                }
            }
           
        });
        console.log(data, priceKline, amountKline, MA60)
    }).catch(console.error)
}
module.exports = train;