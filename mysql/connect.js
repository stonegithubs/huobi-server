const mysql       = require('mysql');
var mysqlConfig = require('config').get('tencentMysql');

let config = {
  host                : mysqlConfig.host,
  user                : mysqlConfig.user,
  password            : mysqlConfig.password,
  port                : mysqlConfig.port || 3306,
  database            : mysqlConfig.database,
  insecureAuth        : true,
  useConnectionPooling: true,
};
var connection = mysql.createConnection(config);
 
connection.connect();

function handleErr(err) {
  connection.end(() => {
    console.log('connection:', err);
    // connection = mysql.createConnection(config);
    connection.connect();
    connection.on('error', handleErr);
  });
}
connection.on('error', handleErr);

function query (sql, params) {
  return new Promise((resove, reject) => {
    connection.query(sql, params, function (error, results, fields) {
      if (error) {
        handleErr();
        reject(error);
        return;
      };
      resove(results);
    });
  })
}

exports.query = query;