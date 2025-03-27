const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const componente = require("./componente.js");
const menu = require("../menu.js");
const imagen = require("../imagen.js");

function addComponenteBlog(idComponente, titulo, fecha, imagen_, descripcion) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      const idPadre = await componente.obtenerPaginaDeComponente(idComponente);
      const idPagina = await menu.registrarMenuId(
        titulo,
        idPadre,
        constantes.TIPO_PAGINA_GENERAL,
        ""
      );
      const idImagen = await imagen.subirImagen(titulo, imagen_);

      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".componente_blog(nid_componente, titulo, fecha, nid_imagen, nid_menu, descripcion) values(" +
          conexion.dbConn.escape(idComponente) +
          ", " +
          conexion.dbConn.escape(titulo) +
          ", " +
          "str_to_date(" +
          conexion.dbConn.escape(fecha) +
          ", '%Y-%m-%d')" +
          ", " +
          conexion.dbConn.escape(idImagen) +
          ", " +
          conexion.dbConn.escape(idPagina) +
          ", " +
          conexion.dbConn.escape(descripcion) +
          ")",

        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(new Error("Error al añadir componente blog"));
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function obtenerComponenteBlog(idComponente) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nid_componente, titulo, fecha, nid_imagen, nid_menu, descripcion from " +
        constantes.ESQUEMA_BD +
        ".componente_blog where nid_componente = " +
        conexion.dbConn.escape(idComponente) +
        " order by fecha desc",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(new Error("Error al obtener componente blog"));
        } else {
          if (results.length > 0) {
            resolve(results);
          } else {
            reject(new Error("Error al obtener componente blog"));
          }
        }
      }
    );
  });
}

function eliminarElementoBlog(idComponente, idImagen, idMenu) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".componente_blog where nid_componente = " +
          conexion.dbConn.escape(idComponente) +
          " and nid_imagen = " +
          conexion.dbConn.escape(idImagen) +
          " and nid_menu = " +
          conexion.dbConn.escape(idMenu),
        async (error, result, fields) => {
          try {
            if (error) {
              console.log(error);
              conexion.dbConn.rollback();
              reject(error);
            } else {
              await menu.eliminarMenu(idMenu);
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

function numeroElementos(idComponente) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) num from " +
        constantes.ESQUEMA_BD +
        ".componente_blog where nid_componente = " +
        conexion.dbConn.escape(idComponente),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(0);
        } else {
          resolve(results[0].num);
        }
      }
    );
  });
}

function eliminarComponenteBlog(idPagina, idComponente, tipoAsociacion) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      const cantidadElementos = await numeroElementos(idComponente);
      if (cantidadElementos > 0) {
        try {
          await componente.eliminarComponenteComun(
            idComponente,
            idPagina,
            tipoAsociacion
          );
          resolve();
        } catch (error) {
          console.log(error);
          reject(error);
        }
      } else {
        reject(new Error("No se puede eliminar el componente"));
      }
    });
  });
}

module.exports.addComponenteBlog = addComponenteBlog;
module.exports.obtenerComponenteBlog = obtenerComponenteBlog;
module.exports.eliminarElementoBlog = eliminarElementoBlog;
module.exports.eliminarComponenteBlog = eliminarComponenteBlog;
