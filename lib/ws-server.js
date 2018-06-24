const http = require('http');
const WebSocket = require('ws');
const WShuobi = require('./ws-huobi');

const wss = new WebSocket.Server({ noServer: true });
let huobiWsIsOpen = false;
wss.on('connection', function connection(ws) {
  
  ws.on('message', function incoming(message) {
    let msg = JSON.parse(message);
    if (msg.key === 'huobi') {
      if (msg.value === 'open' && !huobiWsIsOpen) {
        WShuobi.init(() => {
          huobiWsIsOpen = true;
          ws.send(JSON.stringify({
            isOpen: true,
          }));
        });
        return;
      }
      if (huobiWsIsOpen && msg.value === 'close') {
        huobiWsIsOpen = false;
        try {
          WShuobi.close();
          ws.close();
        } catch (error) {
          // ws.send(JSON.stringify({
          //   error: error,
          // }));
        }
        return;
      }
      if (huobiWsIsOpen) {
        WShuobi.close();
        msg.ws = ws;
        WShuobi.setConfig(msg);
      }
    }
  });
  ws.on('close', function () {
    console.log('wss.close');
  })
});
 
 
function upgrade(request, socket, head) {
  const pathname = request.url;
  if (pathname === '/huobi') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
}

module.exports = upgrade;