
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
    exchange = 'huobi',
    period = '',
    tableName = 'HUOBI_PRESSURE_ZONE'
} = {}) {
    let query =  `
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
        ${tableName}
    WHERE
        time BETWEEN '${time[0]}' AND '${time[1]}'
        AND symbol = '${symbol}'
        AND \`exchange\` = '${exchange}'
    `;
    if (period === '1day') {
        query = `
        SELECT
            MAX(bids_max_1) as bids_max_1,
            MAX(asks_max_1) as asks_max_1,
            MAX(sell_1) as sell_1,
            MAX(buy_1) as buy_1,
            AVG(price) as price,
            DATE_FORMAT(time,'%Y/%m/%d') as time 
        FROM
            ${tableName}
        WHERE
            symbol = '${symbol}'
            AND \`exchange\` = '${exchange}'
        GROUP BY DATE_FORMAT(time,'%Y/%m/%d')
        `;
    }
    return new Promise(function (resolve, reject) {
        connect.query(query).then((mysqlRes, fields) => {
            resolve(mysqlRes, fields);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}
exports.getPressure = getPressure;


// 18249564488
/**
 * 获取资金交易额
 * @return {Promise}
 */
function getTrade({
    symbol = 'btcusdt',
    time = getInterval24(),
    period = '2min',
    exchange = 'huobi'
} = {}) {

    let query = `
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
    `;

    if (period === '1day') {
        query = `
            SELECT
                SUM(buy) as buy,
                SUM(sell) as sell,
                symbol,
                exchange,
                DATE_FORMAT(time,'%Y/%m/%d') as time
            FROM
                HUOBI_TRADE 
            WHERE
                symbol = '${symbol}'
                AND \`exchange\` = '${exchange}'
            GROUP BY DATE_FORMAT(time,'%Y/%m/%d')
        `;
    }

    return new Promise(function (resolve, reject) {
        connect.query(query).then((mysqlRes, fields) => {
            resolve(mysqlRes, fields);
        }).catch((err) => {
            console.error(err);
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