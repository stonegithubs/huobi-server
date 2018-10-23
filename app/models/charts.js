const connect = require('../../mysql/connect');
let sql = require('./sql');



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
            SELECT amount,price,type,DATE_FORMAT(time,'%Y-%m-%d %H:%i:%s') as time FROM HUOBI_PRESSURE_ZONE 
            WHERE time >=(NOW() - interval 24 hour)
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