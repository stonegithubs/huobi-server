const connect = require('../../mysql/connect');
let sql = require('./sql');


/**
 * @param {String}
 * @return {Promise}
 */
function createTable(type) {
    return new Promise(function (resolve, reject) {
        if (sql[type] === undefined) {
            reject(new Error(`sql.${type} is not defined`));
            return;
        }
        connect.query(sql[type]).then((mysqlRes, fields) => {
            resolve(mysqlRes, fields);
        }).catch((err) => {
            reject(err);
        });
    });
}
exports.createTable = createTable;
/**
 * 
 * @param {string} tableName 
 * @return {Promise}
 */
function delTable(tableName) {
    return new Promise(function (resolve, reject) {
        connect.query(`DROP TABLE ${tableName}`).then((mysqlRes, fields) => {
            resolve(mysqlRes, fields);
        }).catch(function(err) {
            reject(err);
        });
    });
}
exports.delTable = delTable;
/**
 * 
 * @param {string} tableName 
 * @param {Object} param
 * @return {Promise}
 */
function insert(tableName = 'HUOBI_DEPTH', param) {
    return new Promise(function (resolve, reject) {
        // let param = {
        //   symbol: '1.symbol',
        //   time: new Date(),
        //   asksList: JSON.stringify([]),
        //   bidsList: JSON.stringify([]),
        // }
        connect.query(`
        INSERT INTO ${tableName} SET ?;
        `, param).then((mysqlRes, fields) => {
                resolve(mysqlRes, fields);
            }).catch((err) => {
                reject(err);
            });
    });
}
exports.insert = insert;