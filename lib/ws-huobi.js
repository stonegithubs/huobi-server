
// const moment = require('moment');
const WebSocket = require('ws');
const pako = require('pako');
const getSameAmount = require('./utils/getSameAmount');

const WS_URL = 'wss://api.huobi.br.com/ws';
var symbols = [];

var WS_SERVER = null;
var WS_HUOBI = null;
let ws_huobi_ping = 0;
let ws_huobi_pre_ping = 0;
/* 是否打开状态 */
function isOpen (ws = WS_HUOBI) {
    return  ws !== null && ws.readyState === WebSocket.OPEN;
};
/* 是否关闭状态 */
function isClosed (ws = WS_HUOBI) {
    return  ws === null || (ws !== null && ws.readyState === WebSocket.CLOSED);
};

function setWSS (ws) {
    if (WS_SERVER === null) {
        WS_SERVER = ws;
    }
}
exports.setWSS = setWSS;

/* 处理返回的数据 */
function handle(data) {
    let symbol = data.ch.split('.')[1];
    let channel = data.ch.split('.')[2];

    switch (channel) {
        case 'depth':
            WS_SERVER.broadcast({
                type: 'WS_HUOBI',
                tick: data.tick,
                symbol: symbol,
            });
            break;
        case 'kline':
            WS_SERVER.broadcast({
                type: 'WS_HUOBI',
                kline: data.tick,
                symbol: symbol,
            });
            break;
        case 'trade':
            WS_SERVER.broadcast({
                type: 'WS_HUOBI',
                trade: data.tick,
                symbol: symbol,
            });
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
        symbols.push(symbol);
    }

    if (action.indexOf('subscribe') > -1 && !isOpen()) {
        WS_SERVER.broadcast({
            type: 'WS_HUOBI',
            status: 'error',
            msg: 'WS_HUOBI 没有打开',
        });
        return;
    }
    console.log(action);
    switch(action) {
        case 'reset':
            exports.close().then(() => {
                exports.open().catch(console);
            }).catch(console);
        case 'open':
            exports.open().catch(console);
            break;
        case 'close':
            exports.close().catch(console);
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

            let text = pako.inflate(data, {
                to: 'string'
            });
            let msg = JSON.parse(text);
            if(msg.status === 'ok') {
                console.log(msg);
            }
            if (msg.ping && isOpen()) {
                WS_HUOBI.send(JSON.stringify({
                    pong: msg.ping
                }));
                console.log(msg.ping);
                ws_huobi_ping = msg.ping;
            } else if (msg.tick || msg.data) {
                handle(msg);
            } else if (msg.status === 'error') {
                console.log(msg);
            } else {
                console.log('text', text);
            }
        });
        WS_HUOBI.on('open', () => {
            resolve(true);
            console.log('WS_HUOBI.open');
        });
        WS_HUOBI.on('close', () => {
            console.log('huobi.close')
            setTimeout(() => {
                exports.open();
            }, 100);
        });
        WS_HUOBI.on('error', err => {
            console.log('WS_HUOBI', err)
            WS_SERVER.broadcast({
                type: 'WS_HUOBI',
                status: 'error',
                msg: err,
            });
            reject(err);
            exports.open();
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
            WS_SERVER.broadcast({
                type: 'WS_HUOBI',
                status: 'ok',
                msg: 'WS_HUOBI open'
            });
            resolve();
        }).catch(err => {
            reject(err);
            console.log('open:err', err)
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
            console.log('WS_HUOBI.close');
            WS_SERVER.broadcast({
                type: 'WS_HUOBI',
                status: 'ok',
                msg: 'WS_HUOBI closed',
            });
            resolve({});
        });
        WS_HUOBI.close();
    });
};

setInterval(function () {
    if (ws_huobi_ping === ws_huobi_pre_ping) {
        console.log('huobi.reset')
        exports.close().then(() => {
            exports.open().catch(console);
        }).catch(console);
    } else {
        ws_huobi_pre_ping = ws_huobi_ping;
    }
}, 1000 * 60 * 10);
