
const connect = require('../../mysql/connect');
const getInterval24 = require('../utils/getInterval24');
let sql = require('./sql');



/**
 * 获取压力位 以amount 体现
 * @param {string} param.symbol
 * @return {Promise}
 */
function getPressure({
    symbol = 'btcusdt',
    time = getInterval24(),
    exchange = 'huobi'
} = {}) {
    return new Promise(function (resolve, reject) {
        connect.query(
            `
            SELECT
                bids_max_1,
                asks_max_1,
                sell_1,
                buy_1,
                bids_max_price,
                asks_max_price,
                price,
                DATE_FORMAT(time,'%Y/%m/%d %H:%i:%s') as time 
            FROM
                HUOBI_PRESSURE_ZONE 
            WHERE
                time BETWEEN '${time[0]}' AND '${time[1]}'
                AND symbol = '${symbol}'
                AND \`exchange\` = '${exchange}'
            `
        ).then((mysqlRes, fields) => {
            resolve(mysqlRes, fields);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}
exports.getPressure = getPressure;



/**
 * 获取资金交易额
 * @return {Promise}
 */
function getTrade({
    symbol = 'btcusdt',
    time = getInterval24(),
    exchange = 'huobi'
} = {}) {
    return new Promise(function (resolve, reject) {
        connect.query(
            `
            SELECT
                buy,
                sell,
                symbol,
                exchange,
                DATE_FORMAT(time,'%Y/%m/%d %H:%i:%s') as time  
            FROM
                HUOBI_TRADE 
            WHERE
                time BETWEEN '${time[0]}' AND '${time[1]}'
                AND symbol = '${symbol}'
                AND \`exchange\` = '${exchange}'
            `
        ).then((mysqlRes, fields) => {
            resolve(mysqlRes, fields);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}
exports.getTrade = getTrade;
/**
 * @return {Promise}
 */
function getWatchSymbols() {
    return new Promise(function (resolve, reject) {
        connect.query(
            `
            SELECT symbol FROM WATCH_SYMBOLS 
            `
        ).then((mysqlRes, fields) => {
            resolve(mysqlRes, fields);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}
exports.getWatchSymbols = getWatchSymbols;