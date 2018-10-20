const throttle = require('lodash.throttle');
const moment = require('moment');
const getSameAmount = require('../utils/getSameAmount');
const AbnormalMonitor = require('../utils/AbnormalMonitor');
const IntervalTask = require('../utils/IntervalTask');
const mysqlModel = require('../models/mysql');



/* 处理返回的数据 */
function handle(data) {
    switch (data.channel) {
        case 'depth':
            handleDepth(data);
            break;
        case 'kline':
            // broadcast(WS_SERVER, {
            //     type: 'WS_HUOBI',
            //     kline: data.tick,
            //     symbol: symbol,
            // });
            break;
        case 'trade':
            // broadcast(WS_SERVER, {
            //     type: 'WS_HUOBI',
            //     trade: data.tick,
            //     symbol: symbol,
            // });
            break;
    }
}

module.exports = handle;


const disTime = 1000 * 10;
const buyMaxAM = new AbnormalMonitor({config: {disTime: disTime}});
const sellMaxAM = new AbnormalMonitor({config: {disTime: disTime}});

const intervalTask = new IntervalTask(1000 * 60);

const handleDepth = throttle(function (data) {

    if (data.tick && data.symbol === 'btcusdt') {
        let bidsFirst = data.tick.bids[0];
        let bidsList = getSameAmount(data.tick.bids, {
            type: 'bids'
        });
        let aksFirst = data.tick.asks[0];
        let asksList = getSameAmount(data.tick.asks, {
            type: 'asks'
        });
        // [ 6584.05, 0.0004 ]
        // [ { count: 1,
        //     amount: '13.0787',
        //     sumCount: '13.0787',
        //     sumMoneny: '86985.78',
        //     sumDollar: '86985.78',
        //     price: '6650.95',
        //     prices: [ 6650.95 ] }
        // ]
        // console.log(111, aksFirst, asksList);

        // 取当前时间
        let ts = Date.now()
        let timeUTC = moment(ts).format("YYYY/MM/DD h:mm:ss");
        // 买1
        let buy1 = {
            amount: bidsFirst[1],
            price: bidsFirst[0],
            symbol: data.symbol,
            time: timeUTC,
            type: 'buy1',
            exchange: 'huobi',
        }
        // 卖1
        let sell1 = {
            amount: aksFirst[1],
            price: aksFirst[0],
            symbol: data.symbol,
            time: timeUTC,
            type: 'sell1',
            exchange: 'huobi',
        }

        // 买量最高
        let bidsMax = {
            amount: bidsList[1].amount,
            price: bidsList[0].price,
            symbol: data.symbol,
            time: timeUTC,
            type: 'bids_max',
            exchange: 'huobi',
        }
        // 卖量最高
        let asksMax = {
            amount: asksList[1].amount,
            price: asksList[0].price,
            symbol: data.symbol,
            time: timeUTC,
            type: 'asks_max',
            exchange: 'huobi',
        }
         // 买个数/卖个数

        buyMaxAM.speed({
            value: Number(bidsList[1].amount),
            ts
        });

        sellMaxAM.speed({
            value: Number(asksList[1].amount),
            ts
        });
        let bidsHistoryStatus = buyMaxAM.historyStatus;
        let asksHistoryStatus = sellMaxAM.historyStatus;
        let buyStatus = getStatusNum(bidsHistoryStatus);
        let sellStatus = getStatusNum(asksHistoryStatus);

        if (
            bidsHistoryStatus.length > 2
            && buyStatus['涨'] === 0
            && buyStatus['跌'] === 0
            && sellStatus['跌'] === 0
            && sellStatus['跌'] === 0
        ) {
            intervalTask.stop();
        }
        if (bidsHistoryStatus[bidsHistoryStatus.length - 1].status !== '横盘' || asksHistoryStatus[asksHistoryStatus.length - 1].status !== '横盘') {
            intervalTask.activate();
        }
        // console.log(bidsHistoryStatus, asksHistoryStatus)
        // 记录量的幅度
        intervalTask.do(() => {
            mysqlModel.insert('HUOBI_PRESSURE_ZONE', buy1);
            mysqlModel.insert('HUOBI_PRESSURE_ZONE', sell1);
            mysqlModel.insert('HUOBI_PRESSURE_ZONE', bidsMax);
            mysqlModel.insert('HUOBI_PRESSURE_ZONE', asksMax);
        });
    }
}, 5000, {trailing: false, leading: true});


/**
 * 获取状态出现的个数
 * @param {Arrar<Object>} status
 * @return {Object}
 */
function getStatusNum(status) {
    if (!Array.isArray(status)) {
        console.error('status not Array');
        return;
    }
    // 状态出现的个数
    let res = {
        '横盘': 0,
        '涨': 0,
        '跌': 0,
    }
    status.forEach(item => {
        if (item.status === '横盘') {
            res['横盘']++;
        } else if(item.status === '涨') {
            res['涨']++;
        } else if(item.status === '跌') {
            res['跌']++;
        }
    });
    return res;
}