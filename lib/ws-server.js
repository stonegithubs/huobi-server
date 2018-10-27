const http = require('http');
const WebSocket = require('ws');
const WS_HUOBI = require('./ws-huobi');

let WS_SERVER = null;
let isConnection = false;

const openWS = function () {
    WS_SERVER = new WebSocket.Server({ noServer: true});
    WS_SERVER.on('connection', function (ws) {
        isConnection = true;
        ws.on('message', function (message) {
            let msg = JSON.parse(message);
            let isOpen = ws.readyState === WebSocket.OPEN;
            if (!isOpen) {
                return;
            }
            if (msg.type === 'ws-huobi') {
                WS_HUOBI.call(msg);
            }
        });
        
        ws.on('err', function (err) {
            console.log('WS_SERVER.err', err);
            // openWS();
            // WS_HUOBI.setWSS(WS_SERVER);
        });
    });
    
    // Broadcast to all.
    WS_SERVER.broadcast = function broadcast(data) {
        WS_SERVER.clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    };
}
openWS();

module.exports = WS_SERVER;
