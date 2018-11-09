const isDev = process.env.NODE_ENV !== 'production';

process.env.UV_THREADPOOL_SIZE = 128;
console.log(process.env.NODE_ENV)
const appConfig = {
    hosts: {
      api_huobi: 'https//api.huobi.br.com',
      huobi_ws: 'wss://api.huobi.br.com/ws',
    },
    isDev,
    // 默认对udst
    prices: {
      btc: 6500,
      etch: 210,
    },
    watchSymbols: ['btcusdt', 'htusdt', 'bchusdt', 'btmusdt']
}
global.appConfig = appConfig;
module.exports = appConfig;