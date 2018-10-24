const mysql       = require('mysql');
var mysqlConfig = require('config').get('mysqlLocal');

var connection = mysql.createConnection({
  host                : mysqlConfig.host,
  user                : mysqlConfig.user,
  password            : mysqlConfig.password,
  port                : mysqlConfig.port || 3306,
  database            : mysqlConfig.database,
  insecureAuth        : true,
  useConnectionPooling: true,
});
 
connection.connect();
connection.on('error', function(err) {
  console.log('connection:', err.code);
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