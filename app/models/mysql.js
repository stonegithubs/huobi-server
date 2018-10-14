const connect = require('../../mysql/connect');



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