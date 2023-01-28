var mysql = require('mysql');
var bd_connection = require('./config/bd.json');
var dbConn = mysql.createConnection(bd_connection);

module.exports.dbConn = dbConn;