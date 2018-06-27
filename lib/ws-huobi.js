// const moment = require('moment');
const WebSocket = require('ws');
const pako = require('pako');
const getSameAmount = require('./utils/getSameAmount');
const WS_URL = 'wss://api.huobi.br.com/ws';



var orderbook = {};
var symbols = [];
var WS_SERVER = null;
var WS_HUOBI = null;
exports.OrderBook = orderbook;

function handle(data) {
    // console.log('received', data.ch, 'data.ts', data.ts, 'crawler.ts', moment().format('x'));
    let symbol = data.ch.split('.')[1];
    let channel = data.ch.split('.')[2];
    switch (channel) {
        case 'depth':
            orderbook[symbol] = data.tick;
            // console.log('depth', data.tick);
            if (WS_SERVER.readyState === WebSocket.OPEN) {
                WS_SERVER.send(JSON.stringify(data));
            }
            // console.log(symbols[0] + '买盘',getSameAmount(data.tick.bids))
            // console.log(symbols[0] + '卖盘',getSameAmount(data.tick.asks))
            break;
        case 'kline':
            // getSameAmount()
            // console.log('kline', data.tick);
            break;
    }
}
function setConfig (data) {
    symbol = data.symbols;
    WS_SERVER = data.ws;
    if (isOpen()) {
        WS_HUOBI.send(JSON.stringify({
            "sub": `market.${symbol}.depth.step0`,
            "id": `${symbol}`
        }));
    }
}
exports.setConfig = setConfig;

function subscribe(ws) {
    // 订阅深度
    // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
    for (let symbol of symbols) {
        ws.send(JSON.stringify({
            "sub": `market.${symbol}.depth.step0`,
            "id": `${symbol}`
        }));
    }
    // 订阅K线
    for (let symbol of symbols) {
        ws.send(JSON.stringify({
            "sub": `market.${symbol}.kline.1day`,
            "id": `${symbol}`
        }));
    }
}

function init(fn) {
    WS_HUOBI = new WebSocket(WS_URL);
    WS_HUOBI.on('open', () => {
        console.log('WS_HUOBI.open');
        // subscribe(WS_HUOBI);
        fn && fn();
    });
    WS_HUOBI.on('message', (data) => {
        if (WS_HUOBI.readyState !== WebSocket.OPEN) {
            return;
        }
        let text = pako.inflate(data, {
            to: 'string'
        });
        let msg = JSON.parse(text);
        if (msg.ping) {
            WS_HUOBI.send(JSON.stringify({
                pong: msg.ping
            }));
        } else if (msg.tick) {
            handle(msg);
        } else {
            if (msg.status === 'error') {
                WS_SERVER && WS_SERVER.send(JSON.stringify({
                    type: 'WS_HUOBI',
                    value: 'error',
                    error: text,
                }));
            }
        }
    });
    WS_HUOBI.on('error', err => {
        console.log('error', error);
        WS_SERVER && WS_SERVER.send(JSON.stringify({
            type: 'WS_HUOBI',
            value: 'error',
            error,
        }));
        init();
    });
    
}
exports.init = init;
exports.close = function (cb) {
    WS_HUOBI.on('close', () => {
        console.log('WS_HUOBI.close');
        cb && cb();
    });
    WS_HUOBI.close();
};
function isOpen () {
    return  WS_HUOBI !== null && WS_HUOBI.readyState === WebSocket.OPEN;
};

exports.isOpen = isOpen;

function isClosed () {
    return  WS_HUOBI !== null && WS_HUOBI.readyState === WebSocket.CLOSED;
};

exports.isClosed = isClosed;