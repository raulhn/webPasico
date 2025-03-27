var mysql = require("mysql");
var bd_connection = require("./config/bd.json");
var bd_connection_web = require("./config/bd_web.json");
var dbConn = mysql.createConnection(bd_connection);
var dbConn_web = mysql.createConnection(bd_connection_web);

module.exports.dbConn = dbConn;
module.exports.dbConn_web = dbConn_web;
