const mysql = require("mysql");
const bdConnection = require("./config/bd.json");
const dbConn = mysql.createConnection(bdConnection);

module.exports.dbConn = dbConn;
