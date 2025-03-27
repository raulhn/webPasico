const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const menu = require("../menu.js");

function existeComponente(nidComponente) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".componente where nid = " +
        conexion.dbConn.escape(nidComponente),
      function (error, results, fields) {
        if (error) return resolve(false);
        if (results.length <= 0) {
          resolve(false);
        }
        resolve(true);
      }
    );
  });
}

/*
    Obtiene la página asociada a un componente
*/
function obtenerPaginaDeComponente(nidComponente) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select max(nid_pagina) pagina from " +
        constantes.ESQUEMA_BD +
        ".pagina_componente where nid_componente = " +
        conexion.dbConn.escape(nidComponente),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(new Error("Error al obtener la pagina de componente"));
        } else if (results.length <= 0) {
          console.log("Error al obtener la página");
          reject(new Error("Error al obtener la pagina de componentes"));
        } else {
          resolve(results[0].pagina);
        }
      }
    );
  });
}

function tipoComponente(nidComponente) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.query(
      "select nTipo from " +
        constantes.ESQUEMA_BD +
        ".componente where nid = " +
        conexion.dbConn.escape(nidComponente),
      function (error, results, field) {
        if (error)
          return reject(new Error("Error al obtener el tipo de componente"));
        else if (results.length <= 0) {
          reject(new Error("No se ha encontrado el componente"));
        } else {
          console.log(results);
          resolve(results[0].nTipo);
        }
      }
    );
  });
}

function esComponenteTexto(nidComponente) {
  return new Promise(function (resolve, reject) {
    existeComponente(nidComponente).then(function (existe) {
      if (existe) {
        tipoComponente(nidComponente).then(function (nTipo) {
          resolve(nTipo === constantes.TIPO_COMPONENTE_TEXTO);
        });
      }
    });
  });
}

function actualizarTexto(textoHtml, nidComponente) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.beginTransaction(() => {
      esComponenteTexto(nidComponente).then(function (bEsComponenteTexto) {
        if (bEsComponenteTexto) {
          conexion.dbConn.query(
            "update " +
              constantes.ESQUEMA_BD +
              ".componente_texto set cTexto = " +
              conexion.dbConn.escape(textoHtml) +
              " where nid = " +
              conexion.dbConn.escape(nidComponente),
            function (error, results, fields) {
              if (error) {
                conexion.dbConn.rollback();
                console.log(error);
                resolve(false);
              } else {
                conexion.dbConn.commit();
                resolve(true);
              }
            }
          );
        }
      });
    });
  });
}

function obtenerUltimoOrden(idPagina) {
  return new Promise((resolve, reject) => {
    console.log("obtenerUltimoOrden -> llega");
    conexion.dbConn.query(
      "select ifnull(max(nOrden), 0) orden from " +
        constantes.ESQUEMA_BD +
        ".pagina_componente where nid_pagina = " +
        conexion.dbConn.escape(idPagina),
      function (error, results, field) {
        if (error) {
          console.log(error);
          resolve(0);
        } else {
          resolve(results[0].orden);
        }
      }
    );
  });
}

function registrarCTexto(nidComponente) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "insert into " +
        constantes.ESQUEMA_BD +
        ".componente_texto(nid) values(" +
        conexion.dbConn.escape(nidComponente) +
        ")",
      function (error, results, field) {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(new Error("Error al registrar el componente de texto"));
        }

        resolve();
      }
    );
  });
}

function registrarImagen(titulo) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "insert into " +
        constantes.ESQUEMA_BD +
        ".imagen(titulo) values(" +
        conexion.dbConn.escape(titulo) +
        ")",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(new Error("Error al registrar la imagen"));
        }
        const idImagen = results.insertId;
        resolve(idImagen);
      }
    );
  });
}

function registrarCImagen(nidComponente, titulo) {
  return new Promise((resolve, reject) => {
    registrarImagen(titulo).then((idImagen) => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".componente_imagen(nid_componente, nid_imagen) values(" +
          conexion.dbConn.escape(nidComponente) +
          ", " +
          conexion.dbConn.escape(idImagen) +
          ")",
        function (error, results, field) {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(new Error("Error al registrar el componente de imagen"));
          }
          resolve();
        }
      );
    });
  });
}

function registrarComponente(tipoComponente) {
  return new Promise((resolve, reject) => {
    console.log("registrarComponente -> llega");

    conexion.dbConn.query(
      "insert into " +
        constantes.ESQUEMA_BD +
        ".componente(nTipo) values(" +
        conexion.dbConn.escape(tipoComponente) +
        ")",
      function (error, results, fields) {
        if (error) {
          console.log("componente->registrarComponente " + error);
          conexion.dbConn.rollback();
          reject(error);
        } else {
          const idComponente = results.insertId;
          resolve(idComponente);
        }
      }
    );
    //  reject();
  });
}

function registrarComponentePagina(idComponente, idPagina, nOrden) {
  return new Promise((resolve, reject) => {
    // Asocia el componente a la página
    conexion.dbConn.query(
      "insert into " +
        constantes.ESQUEMA_BD +
        ".pagina_componente(nid_pagina, nid_componente, nOrden) values(" +
        conexion.dbConn.escape(idPagina) +
        ", " +
        conexion.dbConn.escape(idComponente) +
        ", " +
        conexion.dbConn.escape(nOrden) +
        " + 1)",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(new Error("Error al registrar el componente de Pagina"));
        }
        resolve();
      }
    );
  });
}

function registrarComponenteComponentes(
  idComponente,
  idComponentePadre,
  nOrden
) {
  return new Promise((resolve, reject) => {
    // Asocia el componente a la página
    console.log("registrarComponenteComponentes -> " + nOrden);
    conexion.dbConn.query(
      "insert into " +
        constantes.ESQUEMA_BD +
        ".componente_componentes(nid_componente, nid_componente_hijo, nOrden) values(" +
        conexion.dbConn.escape(idComponentePadre) +
        ", " +
        conexion.dbConn.escape(idComponente) +
        ", " +
        conexion.dbConn.escape(nOrden) +
        ")",
      (error, results, fields) => {
        if (error)
          reject(new Error("Error al registrar el componente de Componentes"));
        resolve();
      }
    );
  });
}

function registrarComponenteComun(tipoComponente, id, tipoAsociacion, nOrden) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      console.log("componente->registrarComponenteComun " + tipoAsociacion);
      registrarComponente(tipoComponente)
        .then((idComponente) => {
          console.log("componente->registrarComponenteComun " + idComponente);
          if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
            console.log("componente->registrarComponenteComun-> pagina ");

            registrarComponentePagina(idComponente, id, nOrden)
              .then(() => {
                resolve(idComponente);
              })
              .catch(() => {
                reject(new Error("Error al registrar el componente Pagina"));
              });
          } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
            console.log("componente->registrarComponenteComun-> componentes ");
            registrarComponenteComponentes(idComponente, id, nOrden)
              .then(() => {
                resolve(idComponente);
              })
              .catch(() => {
                reject(
                  new Error("Error al registrar el componeente de componente")
                );
              });
          }
        })
        .catch(
          (error) => {
            console.log(error);
            console.log("error");
            reject(
              new Error("Se ha producido un error al registrar el componente")
            );
          },
          () => {
            console.log("Se ha producido un error");
          }
        );
    });
  });
}

function registrarComponenteTextoOrden(id, tipoAsociacion, nOrden) {
  return new Promise((resolve, reject) => {
    console.log("registrarComponenteTexto -> llega");
    registrarComponenteComun(
      constantes.TIPO_COMPONENTE_TEXTO,
      id,
      tipoAsociacion,
      nOrden
    )
      .then((nidComponente) => {
        console.log("registrarComponenteTexto -> 1");
        registrarCTexto(nidComponente).then(() => {
          conexion.dbConn.commit();
          resolve();
        });
      })
      .catch(() => {
        conexion.dbConn.rollback();
        reject(new Error("Error al registrar el componente de texto"));
      });
  });
}

function registrarComponenteTexto(id, tipoAsociacion) {
  return new Promise((resolve, reject) => {
    obtenerUltimoOrden(id)
      .then((maxOrden) => {
        registrarComponenteTextoOrden(id, tipoAsociacion, maxOrden).then(() => {
          resolve();
        });
      })
      .catch(() => {
        reject(new Error("Error al registrar el componente de texto"));
      });
  });
}

function registrarComponenteImagenOrden(id, titulo, tipoAsociacion, nOrden) {
  return new Promise((resolve, reject) => {
    registrarComponenteComun(
      constantes.TIPO_COMPONENTE_IMAGEN,
      id,
      tipoAsociacion,
      nOrden
    )
      .then((nidComponente) => {
        registrarCImagen(nidComponente, titulo).then(() => {
          conexion.dbConn.commit();
          resolve();
        });
      })
      .catch(() => {
        conexion.dbConn.rollback();
        reject(new Error("Error al registrar el componente de imagen"));
      });
  });
}

function registrarComponenteImagen(id, titulo, tipoAsociacion) {
  return new Promise((resolve, reject) => {
    console.log("RegistrarComponenteImagen");
    obtenerUltimoOrden(id)
      .then((maxOrden) => {
        registrarComponenteImagenOrden(id, titulo, tipoAsociacion, maxOrden)
          .then(() => {
            conexion.dbConn.commit();
            resolve();
          })
          .catch(() => {
            conexion.dbConn.rollback();
            reject(new Error("Error al registrar el componete de Imagen"));
          });
      })
      .catch(() => {
        console.log("Error imagen");
      });
  });
}

function registrarCVideo(nidComponente, url) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "insert into " +
        constantes.ESQUEMA_BD +
        ".componente_video(nid_componente, url) values(" +
        conexion.dbConn.escape(nidComponente) +
        ", " +
        conexion.dbConn.escape(url) +
        ")",
      function (error, results, field) {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(new Error("Error al registrar el componente de Video"));
        }
        resolve();
      }
    );
  });
}

function registrarComponenteVideoOrden(id, url, tipoAsociacion, nOrden) {
  return new Promise((resolve, reject) => {
    registrarComponenteComun(
      constantes.TIPO_COMPONENTE_VIDEO,
      id,
      tipoAsociacion,
      nOrden
    )
      .then((nidComponente) => {
        registrarCVideo(nidComponente, url).then(() => {
          conexion.dbConn.commit();
          resolve();
        });
      })
      .catch(() => {
        conexion.dbConn.rollback();
        reject(new Error("Error al registrar el componente de video"));
      });
  });
}

function registrarComponenteVideo(id, url, tipoAsociacion) {
  return new Promise((resolve, reject) => {
    console.log("RegistrarComponenteVideo");
    obtenerUltimoOrden(id)
      .then((maxOrden) => {
        registrarComponenteVideoOrden(id, url, tipoAsociacion, maxOrden)
          .then(() => {
            conexion.dbConn.commit();
            resolve();
          })
          .catch(() => {
            conexion.dbConn.rollback();
            reject(new Error("Error al registrar el componente de video"));
          });
      })
      .catch(() => {
        console.log("Error Video");
        reject(new Error("Error al registrar el componente de video"));
      });
  });
}

function registrarCGaleria(nidComponente, titulo, descripcion) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "insert into " +
        constantes.ESQUEMA_BD +
        ".componente_galeria(nid_componente, titulo, descripcion) values(" +
        conexion.dbConn.escape(nidComponente) +
        ", " +
        conexion.dbConn.escape(titulo) +
        ", " +
        conexion.dbConn.escape(descripcion) +
        ")",
      function (error, results, field) {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(new Error("Error al registrar el componente de Galería"));
        }
        resolve();
      }
    );
  });
}

function registrarComponenteGaleriaOrden(
  id,
  titulo,
  descripcion,
  tipoAsociacion,
  nOrden
) {
  return new Promise((resolve, reject) => {
    registrarComponenteComun(
      constantes.TIPO_COMPONENTE_GALERIA,
      id,
      tipoAsociacion,
      nOrden
    )
      .then((nidComponente) => {
        registrarCGaleria(nidComponente, titulo, descripcion).then(() => {
          conexion.dbConn.commit();
          resolve();
        });
      })
      .catch(() => {
        conexion.dbConn.rollback();
        reject(new Error("Error al registrar el componente de Galería"));
      });
  });
}

function registrarComponenteGaleria(id, titulo, descripcion, tipoAsociacion) {
  return new Promise((resolve, reject) => {
    console.log("Registrar componente_galeria");
    obtenerUltimoOrden(id)
      .then((maxOrden) => {
        registrarComponenteGaleriaOrden(
          id,
          titulo,
          descripcion,
          tipoAsociacion,
          maxOrden
        )
          .then(() => {
            conexion.dbConn.commit();
            resolve();
          })
          .catch(() => {
            conexion.dbConn.rollback();
            reject(new Error("Error al registrar el componente de Galeria"));
          });
      })
      .catch(() => {
        console.log("Error galeria");
        reject(new Error("Error al registrar el componente de Galeria"));
      });
  });
}

/**
 * Componente para listas de páginas
 * @param {Id de la página donde se ubicará el componente} id
 * @param {Si la asociación del componente es a un a página o a un compoennte de componentes} tipoAsociacion
 * @param {Orden en el que se va a colocar la página} nOrden
 * @returns
 */
function registrarComponentePaginasOrden(id, tipoAsociacion, nOrden) {
  return new Promise((resolve, reject) => {
    registrarComponenteComun(
      constantes.TIPO_COMPONENTE_PAGINAS,
      id,
      tipoAsociacion,
      nOrden
    )
      .then((nidComponente) => {
        console.log("Nuevo componente " + nidComponente);
        conexion.dbConn.commit();
        resolve();
      })
      .catch(() => {
        conexion.dbConn.rollback();
        reject(new Error("Error al registrar el componente de Paginas"));
      });
  });
}

/**
 * Componente para listas de páginas
 * @param {Id de la página donde se ubicará el componente} id
 * @param {Si la asociación del componente es a un a página o a un compoennte de componentes} tipoAsociacion
 * @returns
 */
function registrarComponentePaginas(id, tipoAsociacion) {
  return new Promise((resolve, reject) => {
    obtenerUltimoOrden(id)
      .then((maxOrden) => {
        registrarComponentePaginasOrden(id, tipoAsociacion, maxOrden)
          .then(() => {
            conexion.dbConn.commit();
            resolve();
          })
          .catch(() => {
            console.log("Error");
            conexion.dbConn.rollback();
            reject(new Error("Error al registrar el componente de Paginas"));
          });
      })
      .catch(() => {
        console.log("Error componente paginas");
        reject(new Error("Error al registrar el componente de Paginas"));
      });
  });
}

function registrarComponenteCaruselOrden(
  id,
  tipoAsociacion,
  elementosSimultaneos,
  nOrden
) {
  return new Promise((resolve, reject) => {
    console.log("Tipo de asociacion " + tipoAsociacion);
    registrarComponenteComun(
      constantes.TIPO_COMPONENTE_CARUSEL,
      id,
      tipoAsociacion,
      nOrden
    )
      .then((nidComponente) => {
        console.log("Nuevo componente " + nidComponente);
        conexion.dbConn.query(
          "insert into " +
            constantes.ESQUEMA_BD +
            ".componente_carusel(nid_componente, elementos_simultaneos) values(" +
            conexion.dbConn.escape(nidComponente) +
            ", " +
            conexion.dbConn.escape(elementosSimultaneos) +
            ")",
          (error, results, fields) => {
            if (error) {
              console.log(error);
              conexion.dbConn.rollback();
              reject(new Error("Error al registrar el componente de Carrusel"));
            } else {
              conexion.dbConn.commit();
              resolve();
            }
          }
        );
      })
      .catch(() => {
        console.log("Error componente carusel");
        reject(new Error("Error al registrar el componente de Carrusel"));
      });
  });
}
function registrarComponenteCarusel(id, tipoAsociacion, elementosSimultaneos) {
  return new Promise((resolve, reject) => {
    console.log("4");
    obtenerUltimoOrden(id).then((maxOrden) => {
      registrarComponenteCaruselOrden(
        id,
        tipoAsociacion,
        elementosSimultaneos,
        maxOrden
      )
        .then(() => {
          conexion.dbConn.commit();
          resolve();
        })
        .catch(() => {
          console.log("Error");
          conexion.dbConn.rollback();
          reject(new Error("Error al registrar el componente de Carrusel"));
        });
    });
  });
}

function obtieneComponenteTexto(idComponente) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".componente_texto where nid = " +
        conexion.dbConn.escape(idComponente),
      function (error, results, field) {
        if (error) {
          console.log(error);
          reject(new Error("Error recuperar el componente de texto"));
        }
        if (results.length < 1) {
          reject(new Error("Error recuperar el componente de texto"));
        }
        resolve(results[0]);
      }
    );
  });
}

function eliminarComponente(idComponente) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.query(
      "delete from " +
        constantes.ESQUEMA_BD +
        ".componente where nid = " +
        conexion.dbConn.escape(idComponente),
      function (error, results, field) {
        if (error) {
          console.log(error);
          reject(new Error("Error al eliminar el componente"));
        } else {
          resolve();
        }
      }
    );
  });
}

function eliminarPaginaComponente(idPagina, idComponente) {
  return new Promise(function (resolve, reject) {
    console.log("eliminarPaginaComponente");
    obtieneOrden(idPagina, idComponente).then((nOrden) => {
      console.log("Orden " + nOrden);
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".pagina_componente where nid_componente = " +
          conexion.dbConn.escape(idComponente),
        function (error, results, field) {
          if (error) {
            console.log(error);
            reject(new Error("Error al eliminar la pagina de componente"));
          }

          conexion.dbConn.query(
            "update " +
              constantes.ESQUEMA_BD +
              ".pagina_componente set nOrden = nOrden - 1 where nOrden > " +
              conexion.dbConn.escape(nOrden) +
              " and nid_pagina = " +
              conexion.dbConn.escape(idPagina),
            (error, results, field) => {
              console.log("actualiza orden");
              if (error) {
                console.log(error);
                reject(new Error("Error al eliminar la pagina de componente"));
              } else {
                console.log("elimina componente");
                eliminarComponente(idComponente)
                  .then(() => {
                    resolve();
                  })
                  .catch(() =>
                    reject(
                      new Error("Error al eliminar la pagina de componente")
                    )
                  );
              }
            }
          );
        }
      );
    });
  });
}

function eliminarComponenteComponentes(idComponente) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.query(
      "delete from " +
        constantes.ESQUEMA_BD +
        ".componente_componentes where nid_componente_hijo = " +
        conexion.dbConn.escape(idComponente),
      function (error, results, field) {
        if (error) {
          console.log(error);
          reject(new Error("Error al eliminar un componente de componentes"));
        }
        resolve();
      }
    );
  });
}

function eliminarComponenteTexto(idPagina, idComponente, tipoAsociacion) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.beginTransaction(function () {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".componente_texto where nid = " +
          conexion.dbConn.escape(idComponente),
        function (error, results, field) {
          if (error) {
            reject(new Error("Error al eliminar un componente de texto"));
          }
          console.log("eliminarComponenteTexto-> Eliminar " + tipoAsociacion);
          if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
            eliminarPaginaComponente(idPagina, idComponente)
              .then(() => {
                conexion.dbConn.commit();
                resolve();
              })
              .catch(() => {
                conexion.dbConn.rollback();
                reject(new Error("Error al eliminar un componente de texto"));
              });
          } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
            eliminarComponenteComponentes(idComponente)
              .then(() => {
                conexion.dbConn.commit();
                resolve();
              })
              .catch(() => {
                conexion.dbConn.rollback();
                reject(new Error("Error al eliminar un componente de texto"));
              });
          }
        }
      );
    });
  });
}

function eliminarComponenteImagen(idPagina, idComponente, tipoAsociacion) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.beginTransaction(function () {
      console.log("Eliminar " + idComponente);
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".componente_imagen where nid_componente = " +
          conexion.dbConn.escape(idComponente),
        function (error, results, field) {
          if (error) {
            console.log(error);
            reject(new Error("Error al eliminar el componente de Imagen"));
          }
          if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
            eliminarPaginaComponente(idPagina, idComponente)
              .then(() => {
                conexion.dbConn.commit();
                resolve();
              })
              .catch(() => {
                conexion.dbConn.rollback();
                reject(new Error("Error al eliminar el componente de Imagen"));
              });
          } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
            console.log("componente componentes");
            eliminarComponenteComponentes(idComponente)
              .then(() => {
                conexion.dbConn.commit();
                resolve();
              })
              .catch(() => {
                conexion.dbConn.rollback();
                reject(new Error("Error al eliminar el componente de Imagen"));
              });
          }
        }
      );
    });
  });
}

function eliminarComponenteVideo(idPagina, idComponente, tipoAsociacion) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.beginTransaction(function () {
      console.log("Eliminar " + idComponente);
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".componente_video where nid_componente = " +
          conexion.dbConn.escape(idComponente),
        function (error, results, field) {
          if (error) {
            console.log(error);
            reject(new Error("Error al eliminar el componente de Video"));
          }
          if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
            eliminarPaginaComponente(idPagina, idComponente)
              .then(() => {
                conexion.dbConn.commit();
                resolve();
              })
              .catch(() => {
                conexion.dbConn.rollback();
                reject(new Error("Error al eliminar el componente de Video"));
              });
          } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
            console.log("componente componentes");
            eliminarComponenteComponentes(idComponente)
              .then(() => {
                conexion.dbConn.commit();
                resolve();
              })
              .catch(() => {
                conexion.dbConn.rollback();
                reject(new Error("Error al eliminar el componente de Video"));
              });
          }
        }
      );
    });
  });
}

function eliminarComponenteGaleria(idPagina, idComponente, tipoAsociacion) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.beginTransaction(function () {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".componente_galeria where nid_componente = " +
          conexion.dbConn.escape(idComponente),
        function (error, results, field) {
          if (error) {
            console.log(error);
            reject(new Error("Error al elimianr el componente de Galeria"));
          }
          if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
            eliminarPaginaComponente(idPagina, idComponente)
              .then(() => {
                conexion.dbConn.commit();
                resolve();
              })
              .catch(() => {
                conexion.dbConn.rollback();
                reject(new Error("Error al elimianr el componente de Galeria"));
              });
          } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
            console.log("componente componentes");
            eliminarComponenteComponentes(idComponente)
              .then(() => {
                conexion.dbConn.commit();
                resolve();
              })
              .catch(() => {
                conexion.dbConn.rollback();
                reject(new Error("Error al elimianr el componente de Galeria"));
              });
          }
        }
      );
    });
  });
}

function eliminarComponentePaginas(idPagina, idComponente, tipoAsociacion) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.beginTransaction(function () {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".componente_paginas where nid_componente = " +
          conexion.dbConn.escape(idComponente),
        function (error, results, field) {
          if (error) {
            console.log(error);
            reject(new Error("Error al eliminar componente de Pagina"));
          }
          if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
            console.log(
              "eliminar_componente_paginas -> Eliminar pagina componente"
            );
            eliminarPaginaComponente(idPagina, idComponente)
              .then(() => {
                conexion.dbConn.commit();
                resolve();
              })
              .catch(() => {
                console.log("Error al eliminar paginas componente");
                conexion.dbConn.rollback();
                reject(new Error("Error al eliminar componente de Pagina"));
              });
          } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
            console.log("componente componentes");
            eliminarComponenteComponentes(idComponente)
              .then(() => {
                conexion.dbConn.commit();
                resolve();
              })
              .catch(() => {
                conexion.dbConn.rollback();
                reject(new Error("Error al eliminar componente de Pagina"));
              });
          }
        }
      );
    });
  });
}

async function asyncEliminarComponente(idPagina, idComponente, tipoAsociacion) {
  if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
    console.log("eliminarComponenteCarusel -> Eliminar carusel componente");
    await eliminarPaginaComponente(idPagina, idComponente);
    conexion.dbConn.commit();
  } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
    await eliminarComponenteComponentes(idComponente);
    conexion.dbConn.commit();
  }
}

function eliminarComponenteCarusel(idPagina, idComponente, tipoAsociacion) {
  return new Promise((resolve, reject) => {
    try {
      asyncEliminarComponente(idPagina, idComponente, tipoAsociacion);
      resolve();
    } catch (e) {
      reject(new Error("Error al eliminar el componente de Carrusel"));
    }
  });
}

function obtieneUrlVideo(idComponente) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select url from " +
        constantes.ESQUEMA_BD +
        ".componente_video where nid_componente = " +
        conexion.dbConn.escape(idComponente),
      function (error, results, field) {
        if (error) {
          console.log(error);
          reject(new Error("Error al recuperar la url del video"));
        } else {
          resolve(results[0].url);
        }
      }
    );
  });
}

function obtieneComponentes(idPagina) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".pagina_componente where nid_pagina = " +
        conexion.dbConn.escape(idPagina) +
        " order by nOrden",
      function (error, results, field) {
        if (error) {
          console.log(error);
          reject(new Error("Error al recuperar los componentes"));
        }
        resolve(results);
      }
    );
  });
}

function decrementaOrden(idPagina, idComponente) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.beginTransaction(function () {
      obtieneOrden(idPagina, idComponente).then((orden) => {
        conexion.dbConn.query(
          "update " +
            constantes.ESQUEMA_BD +
            ".pagina_componente set nOrden = nOrden + 1 where nOrden = " +
            conexion.dbConn.escape(orden) +
            " - 1 and nid_pagina = " +
            conexion.dbConn.escape(idPagina),
          function (error, results, field) {
            if (error) {
              console.log(error);
              reject(new Error("Error al decrementare el orden"));
            } else {
              conexion.dbConn.query(
                "update " +
                  constantes.ESQUEMA_BD +
                  ".pagina_componente set nOrden = nOrden - 1 where nid_pagina = " +
                  conexion.dbConn.escape(idPagina) +
                  " and nid_componente = " +
                  conexion.dbConn.escape(idComponente),
                function (error, results, field) {
                  if (error) {
                    console.log(error);
                    conexion.dbConn.rollback();
                    reject(new Error("Error al decrementare el orden"));
                  } else {
                    conexion.dbConn.commit();
                    resolve();
                  }
                }
              );
            }
          }
        );
      });
    });
  });
}

function incrementaOrden(idPagina, idComponente) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.beginTransaction(function () {
      obtieneOrden(idPagina, idComponente).then((orden) => {
        conexion.dbConn.query(
          "update " +
            constantes.ESQUEMA_BD +
            ".pagina_componente set nOrden = nOrden - 1 where nOrden = " +
            conexion.dbConn.escape(orden) +
            "+ 1 and nid_pagina = " +
            conexion.dbConn.escape(idPagina),
          function (error, results, field) {
            if (error) {
              console.log(error);
              reject(new Error("Error al incrementar el orden"));
            } else {
              conexion.dbConn.query(
                "update " +
                  constantes.ESQUEMA_BD +
                  ".pagina_componente set nOrden = nOrden + 1 where nid_pagina = " +
                  conexion.dbConn.escape(idPagina) +
                  " and nid_componente = " +
                  conexion.dbConn.escape(idComponente),
                function (error, results, field) {
                  if (error) {
                    console.log(error);
                    conexion.dbConn.rollback();
                    reject(new Error("Error al incrementar el orden"));
                  } else {
                    conexion.dbConn.commit();
                    resolve();
                  }
                }
              );
            }
          }
        );
      });
    });
  });
}

function obtieneNumeroComponente(idPagina) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.query(
      "select count(*) numero from " +
        constantes.ESQUEMA_BD +
        ".pagina_componente where nid_pagina = " +
        conexion.dbConn.escape(idPagina),
      function (error, results, field) {
        if (error) {
          console.log(error);
          reject(new Error("Error al obtener el numero de componente"));
        }
        resolve(results[0].numero);
      }
    );
  });
}
function obtieneOrden(idPagina, idComponente) {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "select nOrden from " +
          constantes.ESQUEMA_BD +
          ".pagina_componente where nid_pagina = " +
          conexion.dbConn.escape(idPagina) +
          " and nid_componente = " +
          conexion.dbConn.escape(idComponente),
        function (error, results, field) {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(new Error("Error al obtenr el orden"));
          } else {
            console.log("Error " + error);
            console.log("Resultados", results);
            conexion.dbConn.commit();
            resolve(results[0].nOrden);
          }
        }
      );
    });
  });
}

function actualizaOrden(nOrden, bAumento) {
  return new Promise((resolve, reject) => {
    let condicion;
    if (bAumento) {
      condicion = "orden + 1";
    } else {
      condicion = "orden - 1";
    }
    conexion.dbConn.query(
      "update " +
        constantes.ESQUEMA_BD +
        ".componente_paginas set orden = " +
        condicion +
        " where orden > " +
        conexion.dbConn.escape(nOrden),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(new Error("Error al actualizar el orden"));
        } else {
          resolve();
        }
      }
    );
  });
}

function getOrdenPagina(nidComponente, nidPagina) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select orden from " +
        constantes.ESQUEMA_BD +
        ".componente_paginas where nid_componente = " +
        conexion.dbConn.escape(nidComponente) +
        " and nid_pagina = " +
        conexion.dbConn.escape(nidPagina),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(new Error("Error al recuperar el orden de página"));
        } else if (results.length < 1) {
          console.log("No se han obtenido resultados");
          resolve(0);
        } else {
          resolve(results[0].orden);
        }
      }
    );
  });
}

function addPaginaComponente(nidComponente, padre, titulo, descripcion) {
  return new Promise((resolve, reject) => {
    console.log("Registrar menu");
    menu
      .registrarMenuId(titulo, padre, constantes.TIPO_PAGINA_GENERAL, "")
      .then((idPagina) => {
        console.log(idPagina);
        if (idPagina > 0) {
          actualizaOrden(-1, true)
            .then(() => {
              conexion.dbConn.query(
                "insert into " +
                  constantes.ESQUEMA_BD +
                  ".componente_paginas(nid_componente, nid_pagina, descripcion, orden) values(" +
                  conexion.dbConn.escape(nidComponente) +
                  ", " +
                  conexion.dbConn.escape(idPagina) +
                  ", " +
                  conexion.dbConn.escape(descripcion) +
                  ", 0)",
                function (error, results, field) {
                  if (error) {
                    console.log(error);
                    conexion.dbConn.rollback();
                    reject(
                      new Error("Error al añadir una página al componente")
                    );
                  } else {
                    console.log("INSERTADO");
                    resolve();
                  }
                }
              );
            })
            .catch(() => {
              conexion.dbConn.rollback();
              reject(new Error("Error al añadir una página al componente"));
            });
        } else {
          console.log("Error");
          reject(new Error("Error al añadir una página al componente"));
        }
      });
  });
}

function removePaginaComponente(nidComponente, nidPagina) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      getOrdenPagina(nidComponente, nidPagina)
        .then((orden) => {
          conexion.dbConn.query(
            "delete from " +
              constantes.ESQUEMA_BD +
              ".componente_paginas where nid_componente = " +
              conexion.dbConn.escape(nidComponente) +
              " and nid_pagina = " +
              conexion.dbConn.escape(nidPagina),
            (error, results, fields) => {
              if (error) {
                console.log(error);
                conexion.dbConn.rollback();
                reject(
                  new Error("Error al eliminar una página del componente")
                );
              } else {
                actualizaOrden(orden, false);
                menu
                  .eliminarMenu(nidPagina)
                  .then(() => {
                    conexion.dbConn.commit();
                    resolve();
                  })
                  .catch(() => {
                    conexion.dbConn.rollback();
                    reject(
                      new Error("Error al eliminar una página del componente")
                    );
                  });
              }
            }
          );
        })
        .catch(() => {
          conexion.dbConn.rollback();
          reject(new Error("Error al eliminar una página del componente"));
        });
    });
  });
}

function obtenerPaginasComponente(nidComponente) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".componente_paginas where nid_componente = " +
        conexion.dbConn.escape(nidComponente) +
        " order by orden asc",

      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(new Error("Error al obtener la paginas del componente"));
        }
        if (results.length <= 0) {
          console.log("No hay resultados");
          reject(new Error("Error al obtener la paginas del componente"));
        } else {
          resolve(results);
        }
      }
    );
  });
}

async function asyncEliminarComponenteComun(
  idPagina,
  idComponente,
  tipoAsociacion
) {
  if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
    await eliminarComponentePaginas(idPagina, idComponente);
  } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
    await eliminarComponenteComponentes(idComponente);
  }
}

async function eliminarComponenteComun(idComponente, idPagina, tipoAsociacion) {
  return new Promise((resolve, reject) => {
    try {
      asyncEliminarComponenteComun(idPagina, idComponente, tipoAsociacion);
      conexion.dbConn.commit();
      resolve();
    } catch (e) {
      console.log(e);
      conexion.dbConn.rollback();
      reject(new Error("Error al eliminar el componente"));
    }
  });
}

module.exports.tipoComponente = tipoComponente;
module.exports.existeComponente = existeComponente;
module.exports.obtenerPaginaDeComponente = obtenerPaginaDeComponente;
module.exports.actualizarTexto = actualizarTexto;

module.exports.registrarComponenteComun = registrarComponenteComun;

module.exports.registrarComponenteTexto = registrarComponenteTexto;
module.exports.registrarComponenteTextoOrden = registrarComponenteTextoOrden;

module.exports.registrarComponenteImagen = registrarComponenteImagen;
module.exports.registrarComponenteImagenOrden = registrarComponenteImagenOrden;

module.exports.registrarComponenteVideo = registrarComponenteVideo;
module.exports.registrarComponenteVideoOrden = registrarComponenteVideoOrden;

module.exports.registrarComponenteGaleria = registrarComponenteGaleria;
module.exports.registrarComponenteGaleriaOrden =
  registrarComponenteGaleriaOrden;

module.exports.registrarComponenteCarusel = registrarComponenteCarusel;
module.exports.registrarComponenteCaruselOrden =
  registrarComponenteCaruselOrden;

module.exports.registrarComponentePaginas = registrarComponentePaginas;

module.exports.registrarComponente = registrarComponente;

module.exports.obtieneComponenteTexto = obtieneComponenteTexto;
module.exports.obtieneComponentes = obtieneComponentes;

module.exports.eliminarComponenteTexto = eliminarComponenteTexto;
module.exports.eliminarComponenteImagen = eliminarComponenteImagen;
module.exports.eliminarComponenteVideo = eliminarComponenteVideo;
module.exports.eliminarComponenteGaleria = eliminarComponenteGaleria;
module.exports.eliminarComponentePaginas = eliminarComponentePaginas;
module.exports.eliminarComponenteCarusel = eliminarComponenteCarusel;

module.exports.decrementaOrden = decrementaOrden;
module.exports.incrementaOrden = incrementaOrden;
module.exports.obtieneNumeroComponente = obtieneNumeroComponente;
module.exports.obtieneOrden = obtieneOrden;

module.exports.obtieneUrlVideo = obtieneUrlVideo;

module.exports.obtenerUltimoOrden = obtenerUltimoOrden;

module.exports.addPaginaComponente = addPaginaComponente;
module.exports.removePaginaComponente = removePaginaComponente;
module.exports.obtenerPaginasComponente = obtenerPaginasComponente;

module.exports.eliminarPaginaComponente = eliminarPaginaComponente;
module.exports.eliminarComponenteComponentes = eliminarComponenteComponentes;
module.exports.eliminarComponenteComun = eliminarComponenteComun;
