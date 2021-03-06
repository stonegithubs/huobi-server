const throttle = require('lodash.throttle');
const moment = require('moment');
const getSameAmount = require('../utils/getSameAmount');
const getPriceIndex = require('../utils/getPriceIndex');
const AbnormalMonitor = require('../utils/AbnormalMonitor');
const getStatusNum = require('../utils/getStatusNum');
// const LazyTask = require('../utils/LazyTask');
const huobiSymbols = require('../utils/huobiSymbols');
const mysqlModel = require('../models/mysql');
const WS_SERVER = require('../../lib/ws-server');


let exchange = 'huobi';

// 每一个币都存一个throttle包裹的handleDepth方法
const depthHandles = {};


/* 处理返回的数据 */
function handle(data) {
    switch (data.channel) {
        case 'depth':
            if(typeof depthHandles[data.symbol] !== 'function') {
                depthHandles[data.symbol] = throttle(handleDepth, 5000, {trailing: false, leading: true});
            }
            depthHandles[data.symbol](data);
            break;
        case 'kline':
            WS_SERVER.broadcast({
                form: 'WS_HUOBI',
                type: 'kline',
                symbol: data.symbol,
                kline: data.kline,
                ch: data.ch,
            });
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

/* ----------------------------------------------------------------------------- */
let disTime = 1000 * 10;
// 状态异常监控(缓存多个币)
const status = {}
// const buyMaxAM = new AbnormalMonitor({config: {disTime: disTime, recordMaxLen: 6}});
// const sellMaxAM = new AbnormalMonitor({config: {disTime: disTime, recordMaxLen: 6}});

// 懒惰任务，1000 * 60 s后不激活自动停止
// const LazyTask = new LazyTask(1000 * 10);

/**
 * 处理深度数据
 */
const handleDepth = function (data) {
    if (data.tick && data.symbol) {
        const symbol = data.symbol;
        // 价格系数， 价格换算成usdt ，如果交易对是btc， 要*btc的usdt价格
        const _price = getPriceIndex(symbol);

        const originBids = data.tick.bids;
        const originAsks = data.tick.asks;
        let bids1 = originBids[0];
        let bids2 = originBids[1];
        let aks1 = originAsks[0];
        let aks2 = originAsks[1];


         // 处理数据
        let bidsList = getSameAmount(originBids, {
            type: 'bids',
            symbol: symbol,
        });
       
        
        let asksList = getSameAmount(originAsks, {
            type: 'asks',
            symbol: symbol,
        });
        WS_SERVER.broadcast({
            form: 'WS_HUOBI',
            type: 'depth',
            symbol: symbol,
            data: {
                bidsList,
                asksList,
                aks1,
                bids1,
                tick: data.tick,
            },
            ch: data.ch,
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
        // console.log(111, aks1, asksList);

        // 取当前时间
        let ts = Date.now();
        let symbolInfo = huobiSymbols.getSymbolInfo(symbol);
        let amountPrecision = symbolInfo['amount-precision'];
        let pricePrecision = symbolInfo['price-precision'];

        let currentPrice = (bids1[0] + aks1[0]) / 2;
        let insertData = {
            symbol: symbol,
            sell_1: (aks1[1] * aks1[0] * _price).toFixed(1),
            sell_2: (aks2[1] * aks2[0] * _price).toFixed(1),
            buy_1: (bids1[1] * bids1[0] * _price).toFixed(1),
            buy_2: (bids2[1] * bids2[0] * _price).toFixed(1),
            price: (currentPrice).toString().length > pricePrecision ? currentPrice.toFixed(pricePrecision) : currentPrice,
            bids_max_1: bidsList[0].sumDollar,
            bids_max_2: bidsList[1].sumDollar,
            asks_max_1: asksList[0].sumDollar,
            asks_max_2: asksList[1].sumDollar,
            bids_max_price: [bidsList[0].price, bidsList[1].price].join(','),
            asks_max_price: [asksList[0].price, asksList[1].price].join(','),
            time: new Date(ts),
            exchange: exchange,
        }
        // 非监控的币，不写入数据库，直接返回给前端
        if (!appConfig.watchSymbols.includes(symbol)) {
            return;
        }
        /* -------write------- */
        // 缓存多个币的异常监控方法
        let buyMaxAM;
        let sellMaxAM;
        if (status[symbol] === undefined) {
            status[symbol] = {};
            status[symbol].buyMaxAM = new AbnormalMonitor({config: {disTime: disTime, recordMaxLen: 6}});
            status[symbol].sellMaxAM = new AbnormalMonitor({config: {disTime: disTime, recordMaxLen: 6}});
        }
        buyMaxAM = status[symbol].buyMaxAM;
        sellMaxAM = status[symbol].sellMaxAM;

        buyMaxAM.speed({
            value: Number(bidsList[0].sumDollar),
            ts,
            symbol: symbol,
        });
        sellMaxAM.speed({
            value: Number(asksList[0].sumDollar),
            ts,
            symbol: symbol,
        });
        let bidsHistoryStatus = buyMaxAM.historyStatus;
        let asksHistoryStatus = sellMaxAM.historyStatus;
        let buyStatus = getStatusNum(bidsHistoryStatus);
        let sellStatus = getStatusNum(asksHistoryStatus);
        // 无状况
        if (
            bidsHistoryStatus.length > 2
            && buyStatus['涨'] === 0
            && buyStatus['跌'] === 0
            && sellStatus['跌'] === 0
            && sellStatus['跌'] === 0
        ) {
            write(insertData);
        } else if (
            // 异常
            bidsHistoryStatus.length === 1
            || bidsHistoryStatus[bidsHistoryStatus.length - 1].status !== '横盘'
            || asksHistoryStatus[asksHistoryStatus.length - 1].status !== '横盘'
            || Number(insertData.buy_1) > (5 * appConfig.prices.btc)
            || Number(insertData.sell_1) > (5 * appConfig.prices.btc)
        ) {
            write2(insertData);
        }

        // console.log(bidsHistoryStatus, asksHistoryStatus)
        
    }
};


const write = throttle(function(insertData) {
    mysqlModel.insert('HUOBI_PRESSURE_ZONE', insertData);
}, 1000 * 60 * 6, {trailing: false, leading: true});

const write2 = throttle(function(insertData) {
    mysqlModel.insert('HUOBI_PRESSURE_ZONE', insertData);
}, 1000 * 20, {trailing: false, leading: true});
/* -------------------------------------------------------- */
let tempTradeData = {};
/**
 * 处理交易数据
 * @param {Object} data 
 */
const handleTrade = function(data) {
    if (!data.trade) {
        return;
    }
    // data.trade = {
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
    // 2分钟合并一次交易
    let disTime = 2 * 60 * 1000;
    // 先找缓存的数据是否存在
    if (tempTradeData[symbol] === undefined) {
        let _tempData =  mergeTradeData(tradeData.data, ts, _price, symbol, exchange);
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
        let time = new Date(Number(tempTradeData[symbol]._time));
        if (tempTradeData[symbol]) {
            tempTradeData[symbol].time = time;
            tempTradeData[symbol].buy = tempTradeData[symbol].buy.toFixed(2);
            tempTradeData[symbol].sell = tempTradeData[symbol].sell.toFixed(2);
            delete tempTradeData[symbol]._time;
            mysqlModel.insert('HUOBI_TRADE', tempTradeData[symbol]);
        }
        // 开始一个新数据
        let _tempData =  mergeTradeData(tradeData.data, ts, _price, symbol, exchange);
        if (_tempData) {
            tempTradeData[symbol] = _tempData;
        }
    } else {
        // 合并数据
        let _tempData = mergeTradeData(tradeData.data, ts, _price, symbol, exchange);
        tempTradeData[symbol].buy += _tempData.buy;
        tempTradeData[symbol].sell += _tempData.sell;
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
        symbol: symbol,
        buy: 0,
        sell: 0,
        _time: _time,
        exchange: exchange
    }
    if (!Array.isArray(tradeData)) {
        console.error('tradeData must be a Array');
        return;
    }
    // 累加买卖交易量
    tradeData.forEach(item => {
        const amount = item.amount * item.price * _price;
        const direction = item.direction;
        _tempData[direction] = Number((amount + _tempData[direction]).toFixed(2));
    });
    return _tempData;
}