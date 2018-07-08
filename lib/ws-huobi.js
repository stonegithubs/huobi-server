// const moment = require('moment');
const WebSocket = require('ws');
const pako = require('pako');
const getSameAmount = require('./utils/getSameAmount');


const WS_URL = 'wss://api.huobi.br.com/ws';
var symbols = [];
var WS_SERVER = null;
var WS_HUOBI = null;

/* 是否打开状态 */
function isOpen (ws = WS_HUOBI) {
    return  ws !== null && ws.readyState === WebSocket.OPEN;
};
/* 是否关闭状态 */
function isClosed (ws = WS_HUOBI) {
    return  ws === null || (ws !== null && ws.readyState === WebSocket.CLOSED);
};

/* 处理返回的数据 */
function handle(data) {
    let symbol = data.ch.split('.')[1];
    let channel = data.ch.split('.')[2];
    if (WS_SERVER.readyState !== WebSocket.OPEN) {
        return;
    }
    switch (channel) {
        case 'depth':        
            WS_SERVER.send(JSON.stringify({
                type: 'WS_HUOBI',
                tick: data.tick,
                symbol: symbol,
            }));
            break;
        case 'kline':
            WS_SERVER.send(JSON.stringify({
                type: 'WS_HUOBI',
                kline: data.tick,
                symbol: symbol,
            }));
        case 'trade':
            WS_SERVER.send(JSON.stringify({
                type: 'WS_HUOBI',
                trade: data.tick,
                symbol: symbol,
            }));    
            break;
    }
}

/**
 * 订阅数据
 * @param {Objetc} msg 
 */
function call(msg) {
    let action = msg.value;
    let symbol = msg.symbol;
    if (symbol && !symbols.includes(symbol)) {
        symbols = [symbol];
    }
    WS_SERVER = msg.ws;
    if (action.indexOf('subscribe') > -1 && !isOpen()) {
        isOpen(WS_SERVER) && WS_SERVER.send(JSON.stringify({
            type: 'WS_HUOBI',
            status: 'error',
            msg: 'WS_HUOBI 没有打开',
        }));
        return;
    }
    
    switch(action) {
        case 'open':
            exports.open();
            break;
        case 'close':
            exports.close();
            break;
        case 'subscribeDepth':    
            // 订阅深度
            // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
            for (let symbol of symbols) {
                WS_HUOBI.send(JSON.stringify({
                    "sub": `market.${symbol}.depth.step0`,
                    "id": `${symbol}`
                }));
            }
            break;
        case 'subscribeKline':
            // 订阅K线
            for (let symbol of symbols) {
                WS_HUOBI.send(JSON.stringify({
                    "sub": `market.${symbol}.kline.1min`,
                    "id": `${symbol}`
                }));
            }
            break;
        case 'subscribeTrade':
        
            try {
                WS_HUOBI.send(JSON.stringify({
                    "sub": `market.${msg.symbol}.trade.detail`,
                    "id": `${msg.symbol}`
                })); 
            } catch (error) {
                console.log(error)
            }
            break;
    }
}
exports.call = call;
/**
 * 初始化 WS_HUOBI
 * @return {Promise}  
 */
function init(fn) {
    return new Promise(function (resolve, reject) {
        WS_HUOBI = new WebSocket(WS_URL);
        WS_HUOBI.on('message', (data) => {
            if (!isOpen()) {
                return;
            }
            let text = pako.inflate(data, {
                to: 'string'
            });
            let msg = JSON.parse(text);
            if(msg.status === 'ok') {
                console.log(msg);
            }
            if (msg.ping) {
                WS_HUOBI.send(JSON.stringify({
                    pong: msg.ping
                }));
            } else if (msg.tick || msg.data) {
                handle(msg);
            } else if (msg.status === 'error') {
                console.log(msg)
                // isOpen(WS_SERVER) && WS_SERVER.send(JSON.stringify({
                //     type: 'WS_HUOBI',
                //     status: 'error',
                //     msg: text,
                // }));
            }
        });
        WS_HUOBI.on('open', () => {
            resolve(true);
            console.log('WS_HUOBI.open');
        });
        WS_HUOBI.on('error', err => {
            isOpen(WS_SERVER) && WS_SERVER.send(JSON.stringify({
                type: 'WS_HUOBI',
                status: 'error',
                msg: err,
            }));
            reject(false);
        });
    }); 
}
exports.init = init;

/**
 * @return {Promise}
 */
exports.open = function () {
    return new Promise(function (resolve, reject) {
        if (!isClosed()) {
            resolve();
            return;
        }
        init().then(() => {
            isOpen(WS_SERVER) && WS_SERVER.send(JSON.stringify({
                type: 'WS_HUOBI',
                status: 'ok',
                msg: 'WS_HUOBI open'
            }));
            resolve();
        });
    });
};

/**
 * @return {Promise}
 */
exports.close = function () {
    return new Promise(function (resolve, reject) {
        if (!isOpen()) {
            reject({});
            return;
        }
        WS_HUOBI.on('close', () => {
            isOpen(WS_SERVER) && WS_SERVER.send(JSON.stringify({
                type: 'WS_HUOBI',
                status: 'ok',
                msg: 'WS_HUOBI closed',
            }));
            resolve({});
        });
        WS_HUOBI.close();
    })
    
};
