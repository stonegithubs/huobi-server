const Queue = require('../utils/Queue');
const huobiSymbols = require('../utils/huobiSymbols');
const getSameAmount = require('../utils/getSameAmount');
const getPriceIndex = require('../utils/getPriceIndex');
const hbsdk = require('../../lib/sdk/hbsdk');
const mysqlModel = require('../models/mysql');

const queue = new Queue({ limit: 4 });

// 有问题的symbols 或者不需要监控的symbols
const errorSymbols = [ 
    'venusdt',
    'mtxbtc',
    'venbtc',
    'mdsbtc',
    'ekobtc',
    'evxbtc',
    'saltbtc',
    'gxcbtc',
    'bixbtc',
    'bixusdt',
    'bt1btc',
    'bt2btc',
    'bkbtbtc',
    'ucbtc',
    'hotbtc',
    'zjltbtc',
    'cdcbtc' 
]
;

function getAllDetail() {
    
    huobiSymbols.getSymbols().then(list => {
        list.forEach(item => {
            if (
                item['quote-currency'] === 'usdt'
                || item['quote-currency'] === 'btc'
            ) {
                if (appConfig.watchSymbols.includes(item.symbol) || errorSymbols.includes(item.symbol)) {
                    return;
                }
                fecthDepth(item);
            }
        });
    });
    queue.onend = function() {
        queue.clear();
        getAllDetail();
    }
}
exports.getAllDetail = getAllDetail;

function fecthDepth(data) {
    const symbol = data.symbol;

    const queueItem = function () {
        hbsdk.getDepth({
            symbol: symbol,
            type: 'step0'
        }).then((res) => {
            const originBids = res.tick.bids;
            const originAsks = res.tick.asks;

            let originBids1 = originBids[0];
            let originBids2 = originBids[1];
            let originAsks1 = originAsks[0];
            let originAsks2 = originAsks[1];
            let currentPrice = (originBids1[0] + originAsks1[0]) / 2;
            // 价格系数， 价格换算成usdt ，如果交易对是btc， 要*btc的usdt价格
            const _price = getPriceIndex(symbol);
            // 精度
            let symbolInfo = huobiSymbols.getSymbolInfo(data.symbol);
            let amountPrecision = symbolInfo['amount-precision'];
            let pricePrecision = symbolInfo['price-precision'];
            // 原数据的记录
            let buy_1 = (originBids1[1] * originBids1[0] * _price).toFixed(pricePrecision);
            let buy_2 = (originBids2[1] * originBids2[0] * _price).toFixed(pricePrecision);
            let sell_1 = (originAsks1[1] * originAsks1[0] *  _price).toFixed(pricePrecision);
            let sell_2 = (originAsks2[1] * originAsks2[0] * _price).toFixed(pricePrecision);
            let originBidsLen = originBids.length;
            let originAsksLen = originAsks.length;

            // 处理数据
            let bidsList = getSameAmount(originBids, {
                symbol: symbol,
                type: 'bids'
            });
            let asksList = getSameAmount(originAsks, {
                symbol: symbol,
                type: 'asks'
            });
            // 如果处理完后没有数据，则不记录，最好是删除该币
            if (bidsList[1] === undefined || asksList[1] === undefined || !bidsList.length || !asksList.length) {
                queue.done(queueItem);
                errorSymbols.push(symbol);
                return;
            }
            let bids_max_1 = bidsList[0].sumDollar;
            let bids_max_2 = bidsList[1].sumDollar;
            let asks_max_1 = asksList[0].sumDollar;
            let asks_max_2 = asksList[1].sumDollar;
            let bidsLen = bidsList.length;
            let asksLen = asksList.length;

            //最后处理因为sort会改变原数据
            let bidsListOrderByCount = bidsList.sort(function (a, b) {
                return b.count - a.count;
            });
            let asksListOrderByCount = asksList.sort(function (a, b) {
                return b.count - a.count;
            });
            let bidsRobotMaxCount = bidsListOrderByCount[0].count;
            let asksRobotMaxCount = asksListOrderByCount[0].count;

            let insertData = {
                symbol,
                exchange: 'huobi',
                time: new Date(),
                price: (currentPrice).toString().length > pricePrecision ? currentPrice.toFixed(pricePrecision) : currentPrice,
                bids_max_1,
                bids_max_2,
                asks_max_1,
                asks_max_2,

                buy_1,
                buy_2,
                sell_1,
                sell_2,

                originBidsLen,
                originAsksLen,
                bidsLen,
                asksLen,
                bidsRobotMaxCount,
                asksRobotMaxCount,
            }

            mysqlModel.insert('HUOBI_CHARACTERISTIC', insertData).then(function () {
                queue.done(queueItem);
            });
        }).catch((err) => {
            if (!errorSymbols.includes(symbol)) {
                errorSymbols.push(symbol);
            }
            queue.done(queueItem);
        });
    };
    // 会自动开始处理队列
    queue.push(queueItem);
}