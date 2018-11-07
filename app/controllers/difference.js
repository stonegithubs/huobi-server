const Queue = require('../utils/queue');
const huobiSymbols = require('../utils/huobiSymbols');
const getSameAmount = require('../utils/getSameAmount');
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
            let bids = res.tick.bids;
            let asks = res.tick.asks;
            
            let bidsList = getSameAmount(bids, {
                symbol: symbol,
                type: 'bids'
            });
            let asksList = getSameAmount(asks, {
                symbol: symbol,
                type: 'asks'
            });
            if (!bidsList.length || !asksList.length) {
                // 过了很久后处理完了一个
                queue.done(queueItem);
                return;
            }
            // 取第一个二的平均值
            if (bidsList.length > 1) {
                bidsAvg = (Number(bidsList[0].sumMoneny) + Number(bidsList[1].sumMoneny)) / 2;
            } else if (bidsList.length === 1) {
                bidsAvg =  Number(bidsList[0].sumMoneny);
            }
            if (asksList.length > 1) {
                asksAvg = (Number(asksList[0].sumMoneny) + Number(asksList[1].sumMoneny)) / 2;
            } else if (asksList.length === 1) {
                asksAvg =  Number(asksList[0].sumMoneny);
            }

            // 买一/卖一
            let tickDis = bidsAvg / asksAvg;
            // 买一卖一价格($)
            let buy1Money = bidsList[0].sumDollar;
            let sell1Money = asksList[0].sumDollar;
            let bidsListOrderByCount = bidsList.sort(function (a, b) {
                return b.count - a.count;
            });
            let asksListOrderByCount = asksList.sort(function (a, b) {
                return b.count - a.count;
            });
            list.push({
                symbol: _symbols,
                tickDis: tickDis.toFixed(3),
                maxCountDis: (bidsListOrderByCount[0].count / asksListOrderByCount[0].count).toFixed(3),
                lengthDis: (bidsList.length / asksList.length).toFixed(3),
                buy1Money,
                sell1Money,
            });
        });
    };
    // 会自动开始处理队列
    queue.push(queueItem);
}