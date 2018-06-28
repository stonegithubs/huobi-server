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
            switch (msg.value) {
                case 'open':
                    if (WS_HUOBI.isClosed()) {
                        WS_HUOBI.setConfig(msg);
                        WS_HUOBI.init(() => {
                            ws.send(JSON.stringify({
                                type: 'WS_HUOBI',
                                value: 'open',
                            }));
                        });
                    }
                    break;
                case 'close':
                    try {
                        WS_HUOBI.close();
                        ws.close();
                    } catch (error) {
                        // ws.send(JSON.stringify({
                        //   error: error,
                        // }));
                    }
                    break;
                case 'subscribe':
                    if (WS_HUOBI.isOpen()) {
                        WS_HUOBI.close(() => {
                            ws.send(JSON.stringify({
                                type: 'WS_HUOBI',
                                value: 'close',
                            }));
                            msg.ws = ws;
                            WS_HUOBI.init(() => {
                                WS_HUOBI.setConfig(msg);
                                ws.send(JSON.stringify({
                                    type: 'WS_HUOBI',
                                    value: 'open',
                                }));
                            });
                        });
                        return;
                    } else if (WS_HUOBI.isClosed()) {
                        console.log(WS_HUOBI.isClosed())
                        WS_HUOBI.setConfig(msg);
                        WS_HUOBI.init(() => {
                            WS_HUOBI.setConfig(msg);
                            ws.send(JSON.stringify({
                                type: 'WS_HUOBI',
                                value: 'open',
                            }));
                        });
                    }
                    break;
                    
            }
        }
    });
    ws.on('close', function () {
        console.log('WS_SERVER.close');
        WS_HUOBI.close();
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