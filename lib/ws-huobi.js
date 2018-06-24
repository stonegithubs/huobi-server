// const moment = require('moment');
const WebSocket = require('ws');
const pako = require('pako');
const getSameAmount = require('./utils/getSameAmount');
const WS_URL = 'wss://api.huobi.br.com/ws';



var orderbook = {};
var symbols = [];
var _ws = null;
exports.OrderBook = orderbook;

function handle(data) {
    // console.log('received', data.ch, 'data.ts', data.ts, 'crawler.ts', moment().format('x'));
    let symbol = data.ch.split('.')[1];
    let channel = data.ch.split('.')[2];
    switch (channel) {
        case 'depth':
            orderbook[symbol] = data.tick;
            // console.log('depth', data.tick);
            if (_ws.readyState === WebSocket.OPEN) {
                _ws.send(JSON.stringify(data));
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
    _ws = data.ws;
    if (huobi_ws.readyState === WebSocket.OPEN) {
        huobi_ws.send(JSON.stringify({
            "sub": `market.${symbol}.depth.step0`,
            "id": `${symbol}`
        }));
        console.log('set', data.symbols)
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
var huobi_ws
function init(fn) {
    huobi_ws = new WebSocket(WS_URL);
    huobi_ws.on('open', () => {
        console.log('huobi_ws.open');
        // subscribe(huobi_ws);
        fn && fn();
    });
    huobi_ws.on('message', (data) => {
        if (huobi_ws.readyState === WebSocket.CLOSED) {
            return;
        }
        let text = pako.inflate(data, {
            to: 'string'
        });
        let msg = JSON.parse(text);
        if (msg.ping) {
            huobi_ws.send(JSON.stringify({
                pong: msg.ping
            }));
        } else if (msg.tick) {
            // console.log(msg);
            handle(msg);
        } else {
            console.log(text);
        }
    });
    huobi_ws.on('close', () => {
        console.log('huobi_ws.close');
        // init();
    });
    huobi_ws.on('error', err => {
        console.log('error', err);
        init();
    });
    
}
exports.init = init;
exports.close = function () {
    huobi_ws.close();
};