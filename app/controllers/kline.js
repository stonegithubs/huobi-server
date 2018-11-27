
const AbnormalMonitor = require('../utils/AbnormalMonitor');
const hbsdk = require('../../lib/sdk/hbsdk');
const { CalculateMA } = require('../utils/calculateMA');
const appConfig = require('../config');

let pRange = 0.01;
let aRage = 0.5;
let heng = 0;
let dataCount = 1000;
const priceKline = new AbnormalMonitor({config: {range: pRange, disTime: 0, recordMaxLen: dataCount}});
const amountKline = new AbnormalMonitor({config: {range: aRage, disTime: 0, recordMaxLen: dataCount}});

const status  = {
    action: 'buy',
    MAstatus: '<MA%'
}
function train() {
    hbsdk.getKline({
        symbol: 'btcusdt',
        period: '5min',
        size: dataCount,
    }).then((data) => {
        let pMA5 = new CalculateMA(5);
        let pMA30 = new CalculateMA(30);
        let pMA60 = new CalculateMA(60);
        let aMA5 = new CalculateMA(5);
        let rData = data.reverse();
        rData.forEach((item, index) => {
            pMA5.push(rData, index);
            pMA30.push(rData, index);
            pMA60.push(rData, index);
            aMA5.push(rData, index, 'vol')
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
            let prePLast1 = priceKline.historyStatus[priceKline.historyStatus.length - 2];
            let preALast2 = amountKline.historyStatus[amountKline.historyStatus.length - 2];

            let pLast1 = priceKline.historyStatus[priceKline.historyStatus.length - 1];
            let aLast2 = amountKline.historyStatus[amountKline.historyStatus.length - 1];

            if (preALast2.status === '涨' && aLast2.status === '涨') {
                if (
                    // status.action === 'sell' &&
                    (prePLast1.status === '涨' || item.close > (pMA60.last() * 1.02) )) {
                    status.action = 'buy'
                    console.log('卖', new Date(Number(item.id + '000')), (item.close * 1).toFixed(1));
                }
                if (
                    // status.action === 'buy' && 
                    prePLast1.status === '跌' 
                    // && item.close < pMA5.last()
                    && item.close < pMA30.last()
                ) {
                    status.action = 'sell'
                    console.log('买', new Date(Number(item.id + '000')), (item.close * (1 - 0.02)).toFixed(1));
                }
            }
          
           
        });
        console.log(data, priceKline, amountKline, pMA60)
    }).catch(console.error)
}
module.exports = train;