const componente = require("../componentes/componente.js");
const constantes = require("../constantes.js");
const componente_carusel = require("../componentes/componente_carusel.js");
const gestion_usuarios = require("../logica/usuario.js");
const componente_componentes = require("../componentes/componente_componentes.js");
const componente_blog = require("../componentes/componente_blog.js");
const servlet_componente = require("./servlet_componente.js");
const servlet_componente_blog = require("./servlet_componente_blog.js");
const servlet_usuarios = require("./servlet_usuarios.js");

async function registrar_componente_carusel(req, res) {
  let id = req.body.id;
  let tipo_asociacion = req.body.tipo_asociacion;
  let elementos_simultaneos = req.body.elementos_simultaneos;

  let bEsAdministrador = await gestion_usuarios.esAdministrador(
    req.session.nombre
  );
  if (bEsAdministrador) {
    try {
      if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA) {
        await componente.registrar_componente_carusel(
          id,
          tipo_asociacion,
          elementos_simultaneos
        );
        return res
          .status(200)
          .send({ error: false, message: "Componente creado" });
      } else if (tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE) {
        let nOrden = req.body.nOrden;
        await componente.registrar_componente_carusel_orden(
          id,
          tipo_asociacion,
          elementos_simultaneos,
          nOrden
        );
        return res
          .status(200)
          .send({ error: false, message: "Componente creado" });
      }
    } catch (e) {
      return res.status(400).send({
        error: true,
        message: "Error al registrar el componente de carrusel",
      });
    }
  } else {
    return res.status(400).send({
      error: true,
      message: "Error al registrar el componente de carrusel",
    });
  }
}

async function obtener_componente_carusel(req, res) {
  let id_componente = req.params.id_componente;
  try {
    let resultado_carusel =
      await componente_carusel.obtener_componente_carusel(id_componente);
    let elementos_carusel =
      await componente_carusel.obtener_elementos_carusel(id_componente);
    return res.status(200).send({
      error: false,
      componente_carusel: resultado_carusel,
      elementos_carusel: elementos_carusel,
    });
  } catch (error) {
    return res
      .status(400)
      .send({ error: true, message: "Error al obtener el componente carusel" });
  }
}

async function add_imagen_carusel(req, res) {
  let id_componente = req.body.id_componente;
  let titulo = req.body.titulo;
  let fichero = req.files;

  try {
    let bEsAdministrador = await gestion_usuarios.esAdministrador(
      req.session.nombre
    );
    if (bEsAdministrador) {
      await componente_carusel.add_elemento_carusel(
        id_componente,
        titulo,
        fichero
      );
      return res
        .status(200)
        .send({ error: false, message: "Se ha registado el nuevo elemento" });
    } else {
      return res.status(400).send({
        error: true,
        message: "Error al incluir el elemento al carrusel",
      });
    }
  } catch (error) {
    return res.status(400).send({
      error: true,
      message: "Error al incluir el elemento al carrusel",
    });
  }
}

async function eliminar_imagen_carusel(req, res) {
  let id_componente = req.body.id_componente;
  let id_imagen = req.body.id_imagen;
  try {
    let bEsAdministrador = await gestion_usuarios.esAdministrador(
      req.session.nombre
    );
    if (bEsAdministrador) {
      await componente_carusel.eliminar_imagen_carusel(
        id_componente,
        id_imagen
      );
      return res
        .status(200)
        .send({ error: false, message: "Elemento eliminado" });
    } else {
      return res
        .status(400)
        .send({ error: true, message: "Error al eliminar el elemento" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ error: true, message: "Error al eliminar al elemento" });
  }
}

async function actualizar_elementos_simultaneos(req, res) {
  let id_componente = req.body.id_componente;
  let num_elementos = req.body.num_elementos;
  try {
    let bEsAdministrador = await gestion_usuarios.esAdministrador(
      req.session.nombre
    );
    if (bEsAdministrador) {
      await componente_carusel.actualiza_elementos_simultaneos(
        id_componente,
        num_elementos
      );
      return res
        .status(200)
        .send({ error: false, message: "Componente actualizado" });
    } else {
      return res
        .status(400)
        .send({ error: true, message: "Error al actualizar" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      error: true,
      message: "No se ha podido realizar la actualizacion",
    });
  }
}

function eliminar_componente(req, res) {
  let id_componente = req.body.id_componente;
  let tipo_asociacion = req.body.tipo_asociacion;
  let id_pagina;

  if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA) {
    id_pagina = req.body.id_pagina;
  }
  if (servlet_usuarios.esLogueado(req.session.nombre)) {
    let usuario = req.session.nombre;
    gestion_usuarios.esAdministrador(usuario).then((bEsAdministrador) => {
      if (bEsAdministrador) {
        // Obtiene el tipo de componente
        componente.tipo_componente(id_componente).then(async (tipo) => {
          if (tipo == constantes.TIPO_COMPONENTE_TEXTO) {
            console.log("Eliminar componente texto");
            componente
              .eliminar_componente_texto(
                id_pagina,
                id_componente,
                tipo_asociacion
              )
              .then(() => {
                console.log("Eliminado");
                return res
                  .status(200)
                  .send({ error: false, message: "Componente eliminado" });
              })
              .catch(() => {
                console.log("Error");
                return res.status(400).send({ error: true, message: "Error" });
              });
          }
          if (tipo == constantes.TIPO_COMPONENTE_IMAGEN) {
            console.log("Eliminar componente imagen");
            componente
              .eliminar_componente_imagen(
                id_pagina,
                id_componente,
                tipo_asociacion
              )
              .then(() => {
                console.log("Eliminado");
                return res
                  .status(200)
                  .send({ error: false, message: "Componente eliminado" });
              })
              .catch(() => {
                console.log("Error");
                return res.status(400).send({ error: true, message: "Error" });
              });
          }
          if (tipo == constantes.TIPO_COMPONENTE_COMPONENTES) {
            console.log("Eliminar componente componentes");
            {
              componente_componentes
                .eliminar_componente_componentes(id_pagina, id_componente)
                .then(() => {
                  console.log("Eliminado");
                  return res
                    .status(200)
                    .send({ error: false, message: "Componente eliminado" });
                })
                .catch(() => {
                  console.log("Error");
                  return res
                    .status(400)
                    .send({ error: true, message: "Error" });
                });
            }
          }
          if (tipo == constantes.TIPO_COMPONENTE_VIDEO) {
            console.log("Eliminar componente VIDEO");
            componente
              .eliminar_componente_video(
                id_pagina,
                id_componente,
                tipo_asociacion
              )
              .then(() => {
                console.log("Eliminado");
                return res
                  .status(200)
                  .send({ error: false, message: "Componente eliminado" });
              })
              .catch(() => {
                console.log("Error");
                return res.status(400).send({ error: true, message: "Error" });
              });
          }
          if (tipo == constantes.TIPO_COMPONENTE_GALERIA) {
            console.log("Eliminar componente Galeria");
            componente
              .eliminar_componente_galeria(
                id_pagina,
                id_componente,
                tipo_asociacion
              )
              .then(() => {
                console.log("Eliminado");
                return res
                  .status(200)
                  .send({ error: false, message: "Componente eliminado" });
              })
              .catch(() => {
                console.log("Error");
                return res.status(400).send({ error: true, message: "Error" });
              });
          }
          if (tipo == constantes.TIPO_COMPONENTE_PAGINAS) {
            console.log("Eliminar componente Paginas");
            componente
              .eliminar_componente_paginas(
                id_pagina,
                id_componente,
                tipo_asociacion
              )
              .then(() => {
                console.log("Eliminado");
                return res
                  .status(200)
                  .send({ error: false, message: "Componente eliminado" });
              })
              .catch(() => {
                console.log("Error");
                return res.status(400).send({ error: true, message: "Error" });
              });
          }
          if (tipo == constantes.TIPO_COMPONENTE_CARUSEL) {
            console.log("Eliminar componente Carusel");
            try {
              await componente.eliminar_componente_carusel(
                id_pagina,
                id_componente,
                tipo_asociacion
              );
              return res
                .status(200)
                .send({ error: false, message: "Componente eliminado" });
            } catch (error) {
              console.log("Error eliminar componente carusel");
              return res.status(400).send({
                error: true,
                message: "Error al eliminar el componente",
              });
            }
          }
          if (tipo == constantes.TIPO_COMPONENTE_BLOG) {
            console.log("Eliminar componente Blog");
            try {
              await componente_blog.eliminar_componente_blog(
                id_pagina,
                id_componente,
                tipo_asociacion
              );
              return res
                .status(200)
                .send({ error: false, message: "Componente eliminado" });
            } catch (error) {
              console.log(error);
              return res.status(400).send({
                error: true,
                message: "Error al eliminar el componente",
              });
            }
          }
        });
      }
    });
  }
}

function registrar_componente(req, res) {
  let id = req.body.id;
  let tipo_componente = req.body.tipo_componente;
  let tipo_asociacion = req.body.tipo_asociacion;

  if (servlet_usuarios.esLogueado(req.session.nombre)) {
    let usuario = req.session.nombre;
    gestion_usuarios.esAdministrador(usuario).then(function (bEsAdministrador) {
      if (bEsAdministrador) {
        if (tipo_componente == constantes.TIPO_COMPONENTE_TEXTO) {
          if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA) {
            console.log("-- registrar_componente_texto --");
            componente
              .registrar_componente_texto(id, tipo_asociacion)
              .then(() => {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente creado" });
              })
              .catch(() => {
                return res.status(400).send({ error: true, message: "Error" });
              });
          } else if (tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE) {
            let nOrden = req.body.nOrden;
            console.log("-- registrar_componente_texto_orden -- " + nOrden);
            componente
              .registrar_componente_texto_orden(id, tipo_asociacion, nOrden)
              .then(() => {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente creado" });
              })
              .catch(() => {
                return res.status(400).send({ error: true, message: "Error" });
              });
          }
        } else if (tipo_componente == constantes.TIPO_COMPONENTE_IMAGEN) {
          console.log("Registrar Imagen");

          let titulo = req.body.titulo;

          if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA) {
            componente
              .registrar_componente_imagen(id, titulo, tipo_asociacion)
              .then(() => {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente creado" });
              })
              .catch(() => {
                return res.status(400).send({ error: true, message: "Error" });
              });
          } else if (tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE) {
            let nOrden = req.body.nOrden;
            componente
              .registrar_componente_imagen_orden(
                id,
                titulo,
                tipo_asociacion,
                nOrden
              )
              .then(() => {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente creado" });
              })
              .catch(() => {
                return res.status(400).send({ error: true, message: "Error" });
              });
          }
        } else if (tipo_componente == constantes.TIPO_COMPONENTE_VIDEO) {
          console.log("Registrar Video");

          let url = req.body.url;

          if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA) {
            componente
              .registrar_componente_video(id, url, tipo_asociacion)
              .then(() => {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente creado" });
              })
              .catch(() => {
                return res.status(400).send({ error: true, message: "Error" });
              });
          } else if (tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE) {
            let nOrden = req.body.nOrden;
            componente
              .registrar_componente_video_orden(
                id,
                url,
                tipo_asociacion,
                nOrden
              )
              .then(() => {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente creado" });
              })
              .catch(() => {
                return res.status(400).send({ error: true, message: "Error" });
              });
          }
        } else if (tipo_componente == constantes.TIPO_COMPONENTE_GALERIA) {
          console.log("Registrar Galeria");

          let titulo = req.body.titulo;
          let descripcion = req.body.descripcion;

          if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA) {
            componente
              .registrar_componente_galeria(
                id,
                titulo,
                descripcion,
                tipo_asociacion
              )
              .then(() => {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente creado" });
              })
              .catch(() => {
                return res.status(400).send({ error: true, message: "Error" });
              });
          } else if (tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE) {
            let nOrden = req.body.nOrden;
            componente
              .registrar_componente_galeria_orden(
                id,
                titulo,
                descripcion,
                tipo_asociacion,
                nOrden
              )
              .then(() => {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente creado" });
              })
              .catch(() => {
                return res.status(400).send({ error: true, message: "Error" });
              });
          }
        } else if (tipo_componente == constantes.TIPO_COMPONENTE_COMPONENTES) {
          console.log("Registrar Componente Componentes " + tipo_asociacion);
          let nColumnas = req.body.nColumnas;

          if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA) {
            componente_componentes
              .insertar_componente_componentes(id, nColumnas, tipo_asociacion)
              .then(() => {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente creado" });
              })
              .catch(() => {
                return res.status(400).send({ error: true, message: "Error" });
              });
          } else {
            return res
              .status(400)
              .send({ error: true, message: "Operación no permitida" });
          }
        } else if (tipo_componente == constantes.TIPO_COMPONENTE_PAGINAS) {
          if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA) {
            console.log("Registrar componente páginas");
            componente
              .registrar_componente_paginas(id, tipo_asociacion)
              .then(() => {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente creado" });
              })
              .catch(() => {
                return res.status(400).send({ error: true, message: "Error" });
              });
          } else {
            return res
              .status(400)
              .send({ error: true, message: "Operación no permitida" });
          }
        } else if (tipo_componente == constantes.TIPO_COMPONENTE_CARUSEL) {
          console.log("Registrar componente Carrusel");
          servlet_componente.registrar_componente_carusel(req, res);
        } else if (tipo_componente == constantes.TIPO_COMPONENTE_BLOG) {
          console.log("Registrar componente blog");
          servlet_componente_blog.registrar_componente_blog(req, res);
        }
      }
    });
  }
}

function tipo_componente(req, res) {
  let id_componente = req.params.id;

  componente.tipo_componente(id_componente).then(function (tipo) {
    return res
      .status(200)
      .send({ error: false, nTipo: tipo, message: "Tipo componente" });
  });
}

function num_componentes(req, res) {
  let id_pagina = req.params.id_pagina;
  componente.obtiene_numero_componente(id_pagina).then((numero) => {
    return res.status(200).send({ error: false, numero: numero });
  });
}

function obtiene_orden(req, res) {
  let id_pagina = req.params.id_pagina;
  let id_componente = req.params.id_componente;

  componente.obtiene_orden(id_pagina, id_componente).then((orden) => {
    return res.status(200).send({ error: false, orden: orden });
  });
}

function obtener_componentes(req, res) {
  componente
    .obtiene_componentes(req.params.id_pagina)
    .then(function (resultados) {
      return res
        .status(200)
        .send({ error: false, data: resultados, message: "Lista de usuarios" });
    })
    .catch(function () {
      return res.status(400).send({ error: true, message: "Error" });
    });
}

function incrementa_orden(req, res) {
  let id_pagina = req.body.id_pagina;
  let id_componente = req.body.id_componente;

  if (servlet_usuarios.esLogueado(req.session.nombre)) {
    let usuario = req.session.nombre;
    gestion_usuarios.esAdministrador(usuario).then((bEsAdministrador) => {
      if (bEsAdministrador) {
        componente
          .incrementa_orden(id_pagina, id_componente)
          .then(() => {
            return res
              .status(200)
              .send({ error: false, message: "Componente modificado" });
          })
          .catch(() => {
            return res.status(400).send({ error: true, message: "Error" });
          });
      }
    });
  }
}

function decrementa_orden(req, res) {
  let id_pagina = req.body.id_pagina;
  let id_componente = req.body.id_componente;

  if (servlet_usuarios.esLogueado(req.session.nombre)) {
    let usuario = req.session.nombre;
    gestion_usuarios.esAdministrador(usuario).then((bEsAdministrador) => {
      if (bEsAdministrador) {
        componente
          .decrementa_orden(id_pagina, id_componente)
          .then(() => {
            return res
              .status(200)
              .send({ error: false, message: "Componente modificado" });
          })
          .catch(() => {
            return res.status(400).send({ error: true, message: "Error" });
          });
      }
    });
  }
}
module.exports.registrar_componente_carusel = registrar_componente_carusel;
module.exports.obtener_componente_carusel = obtener_componente_carusel;
module.exports.add_imagen_carusel = add_imagen_carusel;
module.exports.eliminar_imagen_carusel = eliminar_imagen_carusel;
module.exports.actualizar_elementos_simultaneos =
  actualizar_elementos_simultaneos;
module.exports.eliminar_componente = eliminar_componente;
module.exports.registrar_componente = registrar_componente;
module.exports.tipo_componente = tipo_componente;
module.exports.num_componentes = num_componentes;
module.exports.obtiene_orden = obtiene_orden;
module.exports.obtener_componentes = obtener_componentes;
module.exports.incrementa_orden = incrementa_orden;
module.exports.decrementa_orden = decrementa_orden;
