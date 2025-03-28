const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const componente = require("./componente.js");
const menu = require("../logica/menu.js");
const imagen = require("../logica/imagen.js");

function add_componente_blog(
  id_componente,
  titulo,
  fecha,
  imagen_,
  descripcion
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      let id_padre =
        await componente.obtener_pagina_de_componente(id_componente);
      let id_pagina = await menu.registrar_menu_id(
        titulo,
        id_padre,
        constantes.TIPO_PAGINA_GENERAL,
        ""
      );
      let id_imagen = await imagen.subir_imagen(titulo, imagen_);

      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".componente_blog(nid_componente, titulo, fecha, nid_imagen, nid_menu, descripcion) values(" +
          conexion.dbConn.escape(id_componente) +
          ", " +
          conexion.dbConn.escape(titulo) +
          ", " +
          "str_to_date(" +
          conexion.dbConn.escape(fecha) +
          ", '%Y-%m-%d')" +
          ", " +
          conexion.dbConn.escape(id_imagen) +
          ", " +
          conexion.dbConn.escape(id_pagina) +
          ", " +
          conexion.dbConn.escape(descripcion) +
          ")",

        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function obtener_componente_blog(id_componente) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nid_componente, titulo, fecha, nid_imagen, nid_menu, descripcion from " +
        constantes.ESQUEMA_BD +
        ".componente_blog where nid_componente = " +
        conexion.dbConn.escape(id_componente) +
        " order by fecha desc",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          if (results.length > 0) {
            resolve(results);
          } else {
            reject();
          }
        }
      }
    );
  });
}

function eliminar_elemento_blog(id_componente, id_imagen, id_menu) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".componente_blog where nid_componente = " +
          conexion.dbConn.escape(id_componente) +
          " and nid_imagen = " +
          conexion.dbConn.escape(id_imagen) +
          " and nid_menu = " +
          conexion.dbConn.escape(id_menu),
        async (error, result, fields) => {
          try {
            if (error) {
              console.log(error);
              conexion.dbConn.rollback();
              reject(error);
            } else {
              await menu.eliminar_menu(id_menu);
              conexion.dbConn.commit();
              resolve();
            }
          } catch (e) {
            conexion.dbConn.rollback();
            console.log(e);
            reject(e);
          }
        }
      );
    });
  });
}

function numero_elementos(id_componente) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) num from " +
        constantes.ESQUEMA_BD +
        ".componente_blog where nid_componente = " +
        conexion.dbConn.escape(id_componente),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(0);
        } else {
          resolve(results[0]["num"]);
        }
      }
    );
  });
}

function eliminar_componente_blog(id_pagina, id_componente, tipo_asociacion) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      let cantidad_elementos = await numero_elementos(id_componente);
      if (cantidad_elementos > 0) {
        try {
          await componente.eliminar_componente_comun(
            id_componente,
            id_pagina,
            tipo_asociacion
          );
          resolve();
        } catch (error) {
          console.log(error);
          reject(error);
        }
      } else {
        reject();
      }
    });
  });
}

module.exports.add_componente_blog = add_componente_blog;
module.exports.obtener_componente_blog = obtener_componente_blog;
module.exports.eliminar_elemento_blog = eliminar_elemento_blog;
module.exports.eliminar_componente_blog = eliminar_componente_blog;
