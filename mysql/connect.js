const mysql       = require('mysql');
var privateConfig = require('config');

const dbConfig = privateConfig.get('dbConfig');

let config = {
  host                : dbConfig.host,
  user                : dbConfig.user,
  password            : dbConfig.password,
  port                : dbConfig.port || 3306,
  database            : dbConfig.database,
  insecureAuth        : true,
  useConnectionPooling: true,
};
var connection = mysql.createConnection(config);
 
connection.connect();

function handleErr(err) {
  connection.end(() => {
    console.log('connection:', err);
    connection = mysql.createConnection(config);
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
