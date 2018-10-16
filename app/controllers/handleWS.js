const throttle = require('lodash.throttle');
const getSameAmount = require('../utils/getSameAmount');

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
        // console.log(bidsList, asksList)
        // store.commit('UPTATE_DEPTH', {
        //     tick: data.tick,
        //     asksList: asksList,
        //     bidsList: bidsList,
        //     bidsFirst: bidsFirst,
        //     aksFirst: aksFirst,
        //     responseSymbol: data.symbol
        // });
    }
}, 5000, {trailing: false, leading: true});