const mysql = require("mysql");
const bdConnection = require("./config/bd.json");
const bdPool = require("./config/bdPool.json");
const dbConn = mysql.createConnection(bdConnection);
const pool = mysql.createPool(bdPool);

module.exports.dbConn = dbConn;
module.exports.pool = pool;
