const mysql       = require('mysql');
var mysqlConfig = require('config').get('mysql');

var connection = mysql.createConnection({
  host     : mysqlConfig.host,
  user     : mysqlConfig.user,
  password : mysqlConfig.password,
  database : mysqlConfig.database,
  insecureAuth: true,
});
 
// connection.connect();
 
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   console.log('wwww', error)
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

function query (sql, params) {
  return new Promise((resove, reject) => {
    connection.query(sql, params, function (error, results, fields) {
      if (error) {
        reject(error);
        throw error;
      };
      resove(results, fields);
      console.log('The solution is: ', results[0].solution);
    });
  })
}

exports.query = query;