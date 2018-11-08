const connect = require('../../mysql/connect');
let sql = require('./sql');




async function initTable() {
    // [ 
    //     RowDataPacket { Tables_in_huobi: 'huobi_depth' },
    //     RowDataPacket { Tables_in_huobi: 'huobi_pressure_zone' }
    // ]

    return connect.query(`SHOW TABLES`).then((mysqlRes, fields) => {
        let index = mysqlRes.findIndex((o) => o.Tables_in_huobi.toUpperCase() === 'HUOBI_PRESSURE_ZONE');
        if (index === -1) {
            createTable('HUOBI_PRESSURE_ZONE');
        }
        index = mysqlRes.findIndex((o) => o.Tables_in_huobi.toUpperCase() === 'HUOBI_TRADE');
        if (index === -1) {
            createTable('HUOBI_TRADE').catch(console.err);
        }
        index = mysqlRes.findIndex((o) => o.Tables_in_huobi.toUpperCase() === 'WATCH_SYMBOLS');
        if (index === -1) {
            createTable('WATCH_SYMBOLS').then(function () {
                // const symbols = ['btcusdt', 'htusdt', 'bchusdt', 'btmusdt'];
                appConfig.watchSymbols.forEach(symbol => {
                    insert('WATCH_SYMBOLS', {symbol});
                });
            }).catch(console.err);
        }
        index = mysqlRes.findIndex((o) => o.Tables_in_huobi.toUpperCase() === 'HUOBI_CHARACTERISTIC');
        if (index === -1) {
            createTable('HUOBI_CHARACTERISTIC').catch(console.err);
        }
    }).catch(error => {
        console.log(error);
    })
}
exports.initTable = initTable;

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