const Queue = require('../utils/queue');
const huobiSymbols = require('../utils/huobiSymbols');
const getSameAmount = require('../utils/getSameAmount');
const getPriceIndex = require('../utils/getPriceIndex');
const hbsdk = require('../../lib/sdk/hbsdk');

const queue = new Queue({ limit: 3 });


function getAllDetail() {
    
    huobiSymbols.getSymbols().then(list => {
        list.forEach(item => {
            if (item['quote-currency'] === 'usdt' || item['quote-currency'] === 'btc') {
                fetchEachDepth(item)
            }
        });
    });
    
}

function fecthDepth(data) {
    const symbol = data['base-currency'] + data['quote-currency'];

    const queueItem = function () {
        hbsdk.getDepth({
            symbol: _symbols,
            type: 'step0'
        }).then((res) => {
            const originBids = res.tick.bids;
            const originAsks = res.tick.asks;

            // 价格系数， 价格换算成usdt ，如果交易对是btc， 要*btc的usdt价格
            const _price = getPriceIndex(symbol);
            // 精度
            let symbolInfo = huobiSymbols.getSymbolInfo(data.symbol);
            let amountPrecision = symbolInfo['amount-precision'];
            let pricePrecision = symbolInfo['price-precision'];
            // 原数据的记录
            let buy1 = (originBids[0][1] * _price).toFixed(pricePrecision);
            let buy2 = (originBids[1][1] * _price).toFixed(pricePrecision);
            let sell1 = (originAsks[0][1] * _price).toFixed(pricePrecision);
            let sell2 = (originAsks[1][1] * _price).toFixed(pricePrecision);
            let originBidsLen = originBids.length;
            let originAsksLen = originAsks.length;

            let bidsList = getSameAmount(originBids, {
                symbol: symbol,
                type: 'bids'
            });
            let asksList = getSameAmount(originAsks, {
                symbol: symbol,
                type: 'asks'
            });
            // 如果处理完后没有数据，则不记录，最好是删除该币
            if (!bidsList.length || !asksList.length) {
                // 过了很久后处理完了一个
                queue.done(queueItem);
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
                buy1,
                buy2,
                sell1,
                sell2,
                originBidsLen,
                originAsksLen,
                bids_max_1,
                bids_max_2,
                asks_max_1,
                asks_max_2,
                bidsLen,
                asksLen,
                bidsRobotMaxCount,
                asksRobotMaxCount,
            }
        });
    };
    // 会自动开始处理队列
    queue.push(queueItem);
}