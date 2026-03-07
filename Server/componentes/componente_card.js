const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const componente = require("./componente.js");

function insertar_componente_card(nid_componente_card, texto, color) {
  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".componente_card(nid_componente_card, texto, color) values(" +
    conexion.dbConn.escape(nid_componente_card) +
    ", " +
    conexion.dbConn.escape(texto) +
    ", " +
    conexion.dbConn.escape(color) +
    ")";
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log("componente_card.js -> insertar_componente_card: ", error);
        reject();
      } else {
        resolve(results.insertId);
      }
    });
  });
}

function atualizar_componente_card(nid_componente_card, texto, color) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".componente_card set texto = " +
    conexion.dbConn.escape(texto) +
    ", color = " +
    conexion.dbConn.escape(color) +
    " where nid_componente_card = " +
    conexion.dbConn.escape(nid_componente_card);
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log("componente_card.js -> atualizar_componente_card: ", error);
        reject();
      } else {
        resolve();
      }
    });
  });
}

function obtener_componente_card(id_componente) {
  const sql =
    "select nid_componente_card, texto, color from " +
    constantes.ESQUEMA_BD +
    ".componente_card where nid_componente_card = " +
    conexion.dbConn.escape(id_componente);
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log("componente_card.js -> obtener_componente_card: ", error);
        reject();
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.insertar_componente_card = insertar_componente_card;
module.exports.obtener_componente_card = obtener_componente_card;
