const http = require('http');
const WebSocket = require('ws');
const WS_HUOBI = require('./ws-huobi');
let WS_SERVER = null;


const openWS = function () {
    WS_SERVER = new WebSocket.Server({ noServer: true});

    let wsSubs = new Map();
   
    WS_SERVER.on('connection', function (ws) {
        ws.on('message', function (message) {
            let msg = JSON.parse(message);
            let isOpen = ws.readyState === WebSocket.OPEN;
            if (!isOpen) {
                return;
            }
            
            if (wsSubs.get(ws) === undefined) {
                wsSubs.set(ws, []);
            }
            let subList = wsSubs.get(ws);
            var index;
            switch(msg.type) {
                case 'sub':
                msg.from = 'client';
                WS_HUOBI.subscribe.sub(ws, msg);
                break;
                case 'unsub':
                msg.from = 'client';
                WS_HUOBI.subscribe.unsub(ws, msg);
                break;
                default:
                return;
            }
            if (msg.type === 'ws-huobi') {
                WS_HUOBI.call(msg);
            }
        });
        ws.on('close', function (err) {
            console.error('WS_SERVER.close', err);
            WS_HUOBI.subscribe.unsub(ws);
        });
        ws.on('error', function (err) {
            console.error('WS_SERVER.err', err);
            // openWS();
            // WS_HUOBI.setWSS(WS_SERVER);
            WS_HUOBI.subscribe.unsub(ws);
        });
    });
    
    // Broadcast to all.
    WS_SERVER.broadcast = function broadcast(data) {
        let subItem = WS_HUOBI.subscribe.subData[data.ch];
        if (subItem && Array.isArray(subItem.subscribers)) {
            subItem.subscribers.forEach(function (client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
        // WS_SERVER.clients.forEach(function (client) {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(JSON.stringify(data));
        //     }
        // });
    };
}
openWS();
module.exports = WS_SERVER;
