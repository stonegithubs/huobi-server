const http = require('http');
const WebSocket = require('ws');
const WS_HUOBI = require('./ws-huobi');

let WS_SERVER = null;


const openWS = function () {
    WS_SERVER = new WebSocket.Server({ noServer: true});
    WS_SERVER.on('connection', function (ws) {
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

WS_HUOBI.setWSS(WS_SERVER);


function upgrade(request, socket, head) {
    const pathname = request.url;
    if (pathname === '/huobi') {
        console.log('upgrade');
        WS_SERVER.handleUpgrade(request, socket, head, function (ws) {
            WS_SERVER.emit('connection', ws, request);
            // ws.on('close', function () {
            //     console.log('WS_SERVER.close');
            //     console.log('clients.size', WS_SERVER.clients.size);
            //     // openWS();
            //     WS_SERVER.handleUpgrade(request, socket, head, function (ws) {
            //         WS_SERVER.emit('connection', ws, request);
            //     });
            //     // if (WS_SERVER.clients.size === 0) {
            //     //     // WS_HUOBI.close();
            //     //     WS_SERVER.emit('connection', ws, request);
            //     // } else {
            //     //     WS_SERVER.emit('connection', ws, request);
            //     // }
            // });
        });
    } else {
        console.log('destroy')
        // socket.destroy();
    }
}

module.exports = upgrade;