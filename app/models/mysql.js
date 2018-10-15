const connect = require('../../mysql/connect');



/**
 * 
 * @return {Promise}
 */
function createTable() {
    return new Promise(function (resolve, reject) {
        connect.query(`
            CREATE TABLE IF NOT EXISTS ${param.tableName}(
                id INT UNSIGNED AUTO_INCREMENT,
                symbol VARCHAR(20) NOT NULL,
                time DATETIME,
                tick VARCHAR(200) NOT NULL,
                asksList VARCHAR(10000) NOT NULL,
                bidsList VARCHAR(10000) NOT NULL,
                PRIMARY KEY ( id )
            )ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `).then((mysqlRes, fields) => {
                resolve(mysqlRes, fields);
        
        }).catch((err) => {
            reject(err);
        })
    });
}


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
        })
    });
}

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
            })
    });
}