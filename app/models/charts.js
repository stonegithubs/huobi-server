const moment = require('moment');
const connect = require('../../mysql/connect');
let sql = require('./sql');


let between24in = [
    moment(Date.now() - (24 * 60 * 60 * 1000)).format("YYYY/MM/DD H:mm:ss"),
    moment().format("YYYY/MM/DD H:mm:ss")
];

/**
 * 获取压力位 以amount 体现
 * @param {string} param.symbol
 * @return {Promise}
 */
function getPressure(param) {
    if (!param.symbol) {
        reject(new Error('param error'));
    }
    return new Promise(function (resolve, reject) {
        connect.query(
            `
            SELECT
                *,
                DATE_FORMAT(time,'%Y/%m/%d %H:%i:%s') as time 
            FROM
                HUOBI_PRESSURE_ZONE 
            WHERE
                time >=(NOW() - interval 24 hour)
                AND symbol = '${param.symbol}'
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
    time = between24in,
    exchange = 'huobi'
} = {}) {
    return new Promise(function (resolve, reject) {
        connect.query(
            `
            SELECT
                *,
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