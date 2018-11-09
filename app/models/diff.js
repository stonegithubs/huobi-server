
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