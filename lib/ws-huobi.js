
// const moment = require('moment');
const WebSocket = require('ws');
const pako = require('pako');

const handleWS = require('../app/controllers/handleWS');
const WS_SERVER = require('./ws-server');
const Subscribe = require('./Subscribe');

const WS_URL = appConfig.hosts.huobi_ws;

// 订阅过的缓存起来
const subscribe = new Subscribe({send: send});
exports.subscribe = subscribe;

// var WS_SERVER = null;
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

/**
 * 
 * @param {WebSocket} ws 
 * @param {Object} data 
 */
function broadcast(ws, data) {
    // if (isOpen(ws)) {
    //     ws.broadcast(data);
    //     return;
    // }
    
    handleWS(data);
    // console.log(data)
}

/* 处理返回的数据 */
function handle(data) {
    let symbol = data.ch.split('.')[1];
    let channel = data.ch.split('.')[2];
    switch (channel) {
        case 'depth':
            broadcast(WS_SERVER, {
                type: 'WS_HUOBI',
                tick: data.tick,
                symbol: symbol,
                channel: channel,
                ch: data.ch,
            });
            break;
        case 'kline':
            broadcast(WS_SERVER, {
                type: 'WS_HUOBI',
                kline: data.tick,
                symbol: symbol,
                channel: channel,
                ch: data.ch,
            });
            break;
        case 'trade':
            broadcast(WS_SERVER, {
                type: 'WS_HUOBI',
                trade: data.tick,
                symbol: symbol,
                channel: channel,
                ch: data.ch,
            });
            break;
    }
}




/**
 * 订阅数据
 * @param {Objetc} msg 
 */
function call(msg) {
    let action = msg.type;
    console.log('call', msg);

    switch(action) {
        case 'reset':
            reset();
        case 'open':
            open().catch(console);
            break;
        case 'close':
            close().catch(console);
            break;
    }
}
exports.call = call;

/**
 * 初始化 WS_HUOBI
 * @return {Promise}  
 */
function init() {
    return new Promise(function (resolve, reject) {
        WS_HUOBI = new WebSocket(WS_URL);
        WS_HUOBI.on('message', (data) => {
            let text = pako.inflate(data, {
                to: 'string'
            });
            let msg = JSON.parse(text);

            if (msg.ping) {
                if (isOpen()) {
                    WS_HUOBI.send(JSON.stringify({
                        pong: msg.ping
                    }));
                }
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
        WS_HUOBI.on('close', (err) => {
            console.log('huobi.close', err);
            setTimeout(() => {
                reset();
            }, 100);
        });
        WS_HUOBI.on('error', err => {
            console.log('WS_HUOBI', err)
            broadcast(WS_SERVER, {
                type: 'WS_HUOBI',
                status: 'error',
                msg: err,
            });
            reject(err);
            reset();
        });
    }); 
}
exports.init = init;

/**
 * @return {Promise}
 */
const open = function () {
    return new Promise(function (resolve, reject) {
        if (!isClosed()) {
            resolve();
            return;
        }
        init().then(() => {
            broadcast(WS_SERVER, {
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
exports.open = open;
/**
 * @return {Promise}
 */
const close = function () {
    return new Promise(function (resolve, reject) {
        if (!isOpen()) {
            setTimeout(() => {
                resolve({});
            }, 100);
            return;
        }
        WS_HUOBI.on('close', () => {
            console.log('WS_HUOBI.close');
            broadcast(WS_SERVER, {
                type: 'WS_HUOBI',
                status: 'ok',
                msg: 'WS_HUOBI closed',
            });
            resolve({});
        });
        WS_HUOBI.close();
    });
};
exports.close = close;

function reset() {
    console.log('huobi.reset')
    close().then(() => {
        open().then(() => {
            setTimeout(() => {
                subscribe.forEach(data => {
                    send(data);
                });
            });
        }).catch(console);
    }).catch(console);
    
}
exports.reset = reset;

function send(data) {
    if(isOpen()) {
        console.log(data)
        try {
            WS_HUOBI.send(JSON.stringify(data));
        } catch (error) {
            console.log(data);
            // throw Error(error);
        }
    }
}
exports.send = send;
// 心跳检测
setInterval(function () {
    if (ws_huobi_ping === ws_huobi_pre_ping) {
        console.log('心跳检测:huobi.reset')
        reset();
    } else {
        ws_huobi_pre_ping = ws_huobi_ping;
    }
}, 1000 * 60 * 30);
