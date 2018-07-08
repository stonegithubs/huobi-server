const http = require('http');
const WebSocket = require('ws');
const WS_HUOBI = require('./ws-huobi');

const WS_SERVER = new WebSocket.Server({ noServer: true});

WS_SERVER.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        let msg = JSON.parse(message);
        let isOpen = ws.readyState === WebSocket.OPEN;
        if (!isOpen) {
            return;
        }
        msg.ws = ws;
        if (msg.type === 'ws-huobi') {
            WS_HUOBI.call(msg);
        }
    });
    ws.on('close', function () {
        console.log('WS_SERVER.close');
        // WS_HUOBI.close();
    })
});


function upgrade(request, socket, head) {
    const pathname = request.url;
    if (pathname === '/huobi') {
        WS_SERVER.handleUpgrade(request, socket, head, function done(ws) {
            WS_SERVER.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
}

module.exports = upgrade;