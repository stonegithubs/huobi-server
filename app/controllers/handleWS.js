const throttle = require('lodash.throttle');
const moment = require('moment');
const getSameAmount = require('../utils/getSameAmount');
const getPriceIndex = require('../utils/getPriceIndex');
const AbnormalMonitor = require('../utils/AbnormalMonitor');
const IntervalTask = require('../utils/IntervalTask');
const mysqlModel = require('../models/mysql');

let exchange = 'huobi';

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
            handleTrade(data);
            break;
    }
}

module.exports = handle;


let disTime = 1000 * 10;
// 状态异常监控
const buyMaxAM = new AbnormalMonitor({config: {disTime: disTime}});
const sellMaxAM = new AbnormalMonitor({config: {disTime: disTime}});
// 懒惰任务，1000 * 60 s后不激活自动停止
const intervalTask = new IntervalTask(1000 * 30);

/**
 * 处理深度数据
 */
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
            exchange: exchange,
        }
        // 卖1
        let sell1 = {
            amount: aksFirst[1],
            price: aksFirst[0],
            symbol: data.symbol,
            time: timeUTC,
            type: 'sell1',
            exchange: exchange,
        }

        // 买量最高
        let bidsMax = {
            amount: bidsList[1].amount,
            price: bidsList[0].price,
            symbol: data.symbol,
            time: timeUTC,
            type: 'bids_max',
            exchange: exchange,
        }
        // 卖量最高
        let asksMax = {
            amount: asksList[1].amount,
            price: asksList[0].price,
            symbol: data.symbol,
            time: timeUTC,
            type: 'asks_max',
            exchange: exchange,
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
        if (
            bidsHistoryStatus[bidsHistoryStatus.length - 1].status !== '横盘'
            || asksHistoryStatus[asksHistoryStatus.length - 1].status !== '横盘'
            || Number(buy1.amount) > 10
            || Number(sell1.amount)
        ) {
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

let tempTradeData = {};
/**
 * 处理交易数据
 * @param {Object} data 
 */
const handleTrade = function(data) {
    if (!data.trade) {
        return;
    }
    // a = {
    //     id: 25385409501,
    //     ts: 1540131649981,
    //     data: [
    //         {
    //             amount: 0.0073,
    //             ts: 1540131649981,
    //             id: 2.5385409501151216e+21,
    //             price: 6637.01,
    //             direction: 'buy'
    //         }
    //     ]
    // }
      
    const tradeData = data.trade;
    let symbol = data.symbol;
    const ts = tradeData.ts;
    // 价格系数， 价格换算成usdt ，如果交易对是btc， 要*btc的usdt价格
    const _price = getPriceIndex(symbol);
    // 时间截取取  8位作为参考, 大概是1分40s之间的交易会汇总(15320829)
    const _time = String(tradeData.ts).substring(0, 8);
    // 时间填充0补齐13位数 -> 15320829 0000000
    const _timeToStringDate = _time.padEnd(13, '0');
    // 2分钟合并一次交易
    let disTime = 2 * 60 * 1000;
    // 先找缓存的数据是否存在
    if (tempTradeData[symbol] === undefined) {
        let _tempData =  mergeTradeData(tradeData.data, ts, _price, symbol, exchange);
        console.log(_tempData)
        if (_tempData) {
            tempTradeData[symbol] =_tempData;
        }
        return;
    }
    // 上一个时间(位数归了0，比实际时间早)
    const preTime = tempTradeData[symbol]._time;
    // 当前时间 > 上一个时间
    if ((ts - preTime)  > disTime) {
        // 记录上一个数据；
        console.log('记录')
        let time = new Date(Number(tempTradeData[symbol]._time));
        let sell = tempTradeData[symbol].sell;
        if (sell) {
            sell.time = time;
            sell.amount = sell.amount.toFixed(2);
        }
        let buy = tempTradeData[symbol].buy;
        if (buy) {
            buy.time = time;
            buy.amount = buy.amount.toFixed(2);
        }
        mysqlModel.insert('HUOBI_TRADE', buy);
        mysqlModel.insert('HUOBI_TRADE', sell);
        // 开始一个新数据
        let _tempData =  mergeTradeData(tradeData.data, ts, _price, symbol, exchange);
        if (_tempData) {
            tempTradeData[symbol] = _tempData;
        }
    } else {
        // 合并数据
        let _tempData = mergeTradeData(tradeData.data, ts, _price, symbol, exchange);
        if (_tempData.buy !== null) {
            if (tempTradeData[symbol].buy === null) {
                tempTradeData[symbol].buy = _tempData.buy;
            } else {
                tempTradeData[symbol].buy.amount += _tempData.buy.amount;
            }
            
        }
        if (_tempData.sell !== null) {
            if (tempTradeData[symbol].sell === null) {
                tempTradeData[symbol].sell = _tempData.sell;
            } else {
                tempTradeData[symbol].sell.amount += _tempData.sell.amount;
            }
        }
    }
}

/**
 * 合并一个时间点的买卖交易量
 * @param {Array<Object>} tradeData
 * @param {string} _time
 * @param {number} _price
 * @param {string} symbol
 * @param {string} exchange
 * @return {Array<Object>}
 */
function mergeTradeData(tradeData, _time, _price, symbol, exchange) {
    let _tempData = {
        buy: null,
        sell: null,
        _time: _time,
    }
    if (!Array.isArray(tradeData)) {
        console.error('tradeData must be a Array');
        return;
    }
    // 累加买卖交易量
    tradeData.forEach(item => {
        const amount = item.amount * item.price * _price;
        const direction = item.direction;
        if (_tempData[direction] === null) {
            _tempData[direction] = {
                symbol: symbol,
                type: direction,
                amount: Number(amount.toFixed(2)),
                exchange: exchange
            };
            return;
        }
        _tempData[direction].amount = Number((amount + _tempData[direction].amount).toFixed(2));
    });
    return _tempData;
}