const mysql       = require('mysql');
const mysqlConfig = require('../../private/mysql.json');

var connection = mysql.createConnection({
  host     : mysqlConfig.host,
  user     : mysqlConfig.user,
  password : mysqlConfig.password,
  database : mysqlConfig.database,
  insecureAuth: true,
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});