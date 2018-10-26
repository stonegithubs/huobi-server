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
connection.on('error', function(err) {
  connection.end(() => {
    connection.connect();
  });
});

function query (sql, params) {
  return new Promise((resove, reject) => {
    connection.query(sql, params, function (error, results, fields) {
      if (error) {
        reject(error);
        return;
      };
      resove(results);
    });
  })
}

exports.query = query;