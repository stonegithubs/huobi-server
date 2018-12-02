
const connect = require('../../mysql/connect');
const getInterval24 = require('../utils/getInterval24');

let sql = require('./sql');



/**
 * 获取特征
 * @param {string} param.symbol
 * @return {Promise}
 */
function getCharacteristic({
    symbol = '',
    time = getInterval24(),
    exchange = 'huobi'
} = {}) {
    return new Promise(function (resolve, reject) {
        connect.query(
            `
            SELECT
                *
            FROM
                HUOBI_CHARACTERISTIC 
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
exports.getCharacteristic = getCharacteristic;

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
} = {}) {
    let query =  `
    SELECT
        bids_max_1,
        asks_max_1,
        sell_1,
        buy_1,
        price,
        DATE_FORMAT(time,'%Y/%m/%d %H:%i:%s') as time 
    FROM
        HUOBI_CHARACTERISTIC
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
            HUOBI_CHARACTERISTIC
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
