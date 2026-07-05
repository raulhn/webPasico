var mysql = require("mysql");
var bd_connection = require("./config/bd.json");
var bdPool = require("./config/bdPool.json");

var dbConn = mysql.createConnection(bd_connection);
const pool = mysql.createPool(bdPool);

module.exports.dbConn = dbConn;
module.exports.pool = pool;
