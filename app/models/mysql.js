const findIndex = require('lodash.findindex');
const connect = require('../../mysql/connect');
let sql = require('./sql');




function init() {

    // [ 
    //     RowDataPacket { Tables_in_huobi: 'huobi_depth' },
    //     RowDataPacket { Tables_in_huobi: 'huobi_pressure_zone' }
    // ]

    connect.query(`SHOW TABLES`).then((mysqlRes, fields) => {
        let index = findIndex(mysqlRes, (o) => o.Tables_in_huobi.toLowerCase() == 'huobi_pressure_zone');
        if (index === -1) {
            createTable('HUOBI_PRESSURE_ZONE');
        }
        index = findIndex(mysqlRes, (o) => o.Tables_in_huobi.toLowerCase() == 'huobi_trade');
        console.log(index)
        if (index === -1) {
            createTable('HUOBI_TRADE').catch(console.err);
        }
    }).catch(error => {
        console.log(error);
    })
}
init();


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
            console.error(err);
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
            console.error(err);
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
        if (Object.prototype.toString.call(param) !== '[object Object]') {
            console.error(tableName + '写入数据格式有误');
            return;
        }
        connect.query(`
        INSERT INTO ${tableName} SET ?;
        `, param).then((mysqlRes, fields) => {
                resolve(mysqlRes, fields);
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
    });
}
exports.insert = insert;