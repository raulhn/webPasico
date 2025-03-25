const componente = require('../componentes/componente.js')
const constantes = require('../constantes.js')
const componenteCarrusel = require('../componentes/componente_carusel.js')
const componenteComponentes = require('../componentes/componente_componentes.js')
const componenteBlog = require('../componentes/componente_blog.js')
const gestionUsuarios = require('../logica/usuario.js')
const parametro = require('../logica/parametro.js')

const servletComun = require('./servlet_comun.js')
const servletComponenteBlog = require('./servlet_componente_blog.js')

async function registrarComponenteCarrusel (req, res) {
  const id = req.body.id
  const tipoAsociacion = req.body.tipoAsociacion
  const elementosSimultaneos = req.body.elementosSimultaneos

  const esAdministrador = await gestionUsuarios.esAdministrador(req.session.nombre)
  if (esAdministrador) {
    try {
      if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
        await componente.registrarComponenteCarusel(id, tipoAsociacion, elementosSimultaneos)
        return res.status(200).send({ error: false, message: 'Componente creado' })
      } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
        const nOrden = req.body.nOrden
        await componente.registrarComponenteCaruselOrden(id, tipoAsociacion, elementosSimultaneos, nOrden)
        return res.status(200).send({ error: false, message: 'Componente creado' })
      }
    } catch (e) {
      return res.status(400).send({ error: true, message: 'Error al registrar el componente de carrusel' })
    }
  } else {
    return res.status(400).send({ error: true, message: 'Error al registrar el componente de carrusel' })
  }
}

async function obtenerComponenteCarrusel (req, res) {
  const idComponente = req.params.idComponente
  try {
    const resultadoCarrusel = await componenteCarrusel.obtenerComponenteCarusel(idComponente)
    const elementosCarrusel = await componenteCarrusel.obtenerElementosCarusel(idComponente)
    return res.status(200).send({ error: false, componenteCarrusel: resultadoCarrusel, elementosCarrusel })
  } catch (error) {
    return res.status(400).send({ error: true, message: 'Error al obtener el componente carrusel' })
  }
}

async function addImagenCarrusel (req, res) {
  const idComponente = req.body.idComponente
  const titulo = req.body.titulo
  const fichero = req.files

  try {
    const esAdministrador = await gestionUsuarios.esAdministrador(req.session.nombre)
    if (esAdministrador) {
      await componenteCarrusel.addElementoCarusel(idComponente, titulo, fichero)
      return res.status(200).send({ error: false, message: 'Se ha registrado el nuevo elemento' })
    } else {
      return res.status(400).send({ error: true, message: 'Error al incluir el elemento al carrusel' })
    }
  } catch (error) {
    return res.status(400).send({ error: true, message: 'Error al incluir el elemento al carrusel' })
  }
}

async function eliminarImagenCarrusel (req, res) {
  const idComponente = req.body.idComponente
  const idImagen = req.body.idImagen
  try {
    const esAdministrador = await gestionUsuarios.esAdministrador(req.session.nombre)
    if (esAdministrador) {
      await componenteCarrusel.eliminarImagenCarusel(idComponente, idImagen)
      return res.status(200).send({ error: false, message: 'Elemento eliminado' })
    } else {
      return res.status(400).send({ error: true, message: 'Error al eliminar el elemento' })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: true, message: 'Error al eliminar el elemento' })
  }
}

async function actualizarElementosSimultaneos (req, res) {
  const idComponente = req.body.idComponente
  const numElementos = req.body.numElementos
  try {
    const esAdministrador = await gestionUsuarios.esAdministrador(req.session.nombre)
    if (esAdministrador) {
      await componenteCarrusel.actualizaElementosSimultaneos(idComponente, numElementos)
      return res.status(200).send({ error: false, message: 'Componente actualizado' })
    } else {
      return res.status(400).send({ error: true, message: 'Error al actualizar' })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: true, message: 'No se ha podido realizar la actualización' })
  }
}

function registrarComponente (req, res) {
  servletComun.comprobacionesLogin(req, res,
    async () => {
      const id = req.body.id
      const tipoComponente = req.body.tipoComponente
      const tipoAsociacion = req.body.tipoAsociacion

      if (tipoComponente === constantes.TIPO_COMPONENTE_TEXTO) {
        if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
          console.log('-- registrarComponenteTexto --')
          await componente.registrarComponenteTexto(id, tipoAsociacion)
          return res.status(200).send({ error: false, message: 'Componente creado' })
        } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
          const nOrden = req.body.nOrden
          console.log('-- registrarComponenteTextoOrden -- ' + nOrden)
          await componente.registrarComponenteTextoOrden(id, tipoAsociacion, nOrden)
          return res.status(200).send({ error: false, message: 'Componente creado' })
        }
      } else if (tipoComponente === constantes.TIPO_COMPONENTE_IMAGEN) {
        console.log('Registrar Imagen')
        const titulo = req.body.titulo

        if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
          await componente.registrarComponenteImagen(id, titulo, tipoAsociacion)
          return res.status(200).send({ error: false, message: 'Componente creado' })
        } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
          const nOrden = req.body.nOrden
          await componente.registrarComponenteImagenOrden(id, titulo, tipoAsociacion, nOrden)
          return res.status(200).send({ error: false, message: 'Componente creado' })
        }
      } else if (tipoComponente === constantes.TIPO_COMPONENTE_VIDEO) {
        console.log('Registrar Video')
        const url = req.body.url

        if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
          await componente.registrarComponenteVideo(id, url, tipoAsociacion)
          return res.status(200).send({ error: false, message: 'Componente creado' })
        } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
          const nOrden = req.body.nOrden
          await componente.registrarComponenteVideoOrden(id, url, tipoAsociacion, nOrden)
          return res.status(200).send({ error: false, message: 'Componente creado' })
        }
      } else if (tipoComponente === constantes.TIPO_COMPONENTE_GALERIA) {
        console.log('Registrar Galeria')

        const titulo = req.body.titulo
        const descripcion = req.body.descripcion

        if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
          await componente.registrarComponenteGaleria(id, titulo, descripcion, tipoAsociacion)
          return res.status(200).send({ error: false, message: 'Componente creado' })
        } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
          const nOrden = req.body.nOrden
          await componente.registrarComponenteGaleriaOrden(id, titulo, descripcion, tipoAsociacion, nOrden)
          return res.status(200).send({ error: false, message: 'Componente creado' })
        }
      } else if (tipoComponente === constantes.TIPO_COMPONENTE_COMPONENTES) {
        const nColumnas = req.body.nColumnas

        if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
          await componenteComponentes.insertarComponenteComponentes(id, nColumnas, tipoAsociacion)
          return res.status(200).send({ error: false, message: 'Componente creado' })
        } else {
          return res.status(400).send({ error: true, message: 'Operación no permitida' })
        }
      } else if (tipoComponente === constantes.TIPO_COMPONENTE_PAGINAS) {
        if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
          const titulo = req.body.titulo
          console.log('Registrar componente páginas')
          await componente.registrarComponentePaginas(id, titulo, tipoAsociacion)
          return res.status(200).send({ error: false, message: 'Componente creado' })
        } else {
          return res.status(400).send({ error: true, message: 'Operación no permitida' })
        }
      } else if (tipoComponente === constantes.TIPO_COMPONENTE_CARUSEL) {
        console.log('Registrar componente Carrusel')
        registrarComponenteCarrusel(req, res)
      } else if (tipoComponente === constantes.TIPO_COMPONENTE_BLOG) {
        console.log('Registrar componente blog')
        servletComponenteBlog.registrarComponenteBlog(req, res)
      }
    }
  )
}

function obtenerTipoComponente (req, res) {
  const idComponente = req.params.id
  componente.tipoComponente(idComponente).then(
    function (tipo) {
      return res.status(200).send({ error: false, nTipo: tipo, message: 'Tipo componente' })
    }
  )
}

function obtenerComponenteTexto (req, res) {
  const idComponente = req.params.id

  try {
    componente.obtieneComponenteTexto(idComponente).then(
      function (resultado) {
        return res.status(200).send({ error: false, componente: resultado, message: 'Componente de texto' })
      })
  } catch (error) {
    return res.status(200).send({ error: true, message: 'No existe el componente' })
  }
}

function obtenerParametro (req, res) {
  const identificador = req.params.identificador
  try {
    parametro(identificador).then(
      function (resultado) {
        return res.status(200).send({ error: false, valor: resultado })
      }
    )
  } catch (error) {
    return res.status(200).send({ error: true, message: 'No existe el parametro' })
  }
}

function obtenerNumeroComponente (req, res) {
  const idPagina = req.params.id_pagina
  componente.obtieneNumeroComponente(idPagina)
    .then((numero) => { return res.status(200).send({ error: false, numero }) })
}

function obtieneOrden (req, res) {
  const idPagina = req.params.id_pagina
  const idComponente = req.params.id_componente

  componente.obtieneOrden(idPagina, idComponente).then((orden) => { return res.status(200).send({ error: false, orden }) })
}

function obtenerComponentes (req, res) {
  componente.obtieneComponentes(req.params.id_pagina).then(
    function (resultados) {
      return res.status(200).send({ error: false, data: resultados, message: 'Lista de usuarios' })
    }
  ).catch(
    function () {
      return res.status(400).send({ error: true, message: 'Error' })
    }
  )
}

function incrementarOrden (req, res) {
  servletComun.comprobacionesLogin(req, res,
    async () => {
      const idPagina = req.body.id_pagina
      const idComponente = req.body.id_componente
      componente.incrementaOrden(idPagina, idComponente).then(
        () => { return res.status(200).send({ error: false, message: 'Componente modificado' }) }
      )
        .catch(
          () => { return res.status(400).send({ error: true, message: 'Error' }) }
        )
    }
  )
}

function decrementarOrden (req, res) {
  servletComun.comprobacionesLogin(req, res,
    () => {
      const idPagina = req.body.id_pagina
      const idComponente = req.body.id_componente

      componente.decrementaOrden(idPagina, idComponente).then(
        () => { return res.status(200).send({ error: false, message: 'Componente modificado' }) }
      )
        .catch(
          () => { return res.status(400).send({ error: true, message: 'Error' }) }
        )
    }
  )
}

function eliminarComponente (req, res) {
  servletComun.comprobacionesLogin(req, res,
    () => {
      const idComponente = req.body.idComponente
      const tipoAsociacion = req.body.tipoAsociacion
      let idPagina

      if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
        idPagina = req.body.idPagina
      }

      // Obtiene el tipo de componente
      componente.tipoComponente(idComponente).then(
        async (tipo) => {
          if (tipo === constantes.TIPO_COMPONENTE_TEXTO) {
            console.log('Eliminar componente texto')
            componente.eliminarComponenteTexto(idPagina, idComponente, tipoAsociacion)
              .then(() => { console.log('Eliminado'); return res.status(200).send({ error: false, message: 'Componente eliminado' }) })
              .catch(() => { console.log('Error'); return res.status(400).send({ error: true, message: 'Error' }) })
          }
          if (tipo === constantes.TIPO_COMPONENTE_IMAGEN) {
            console.log('Eliminar componente imagen')
            componente.eliminarComponenteImagen(idPagina, idComponente, tipoAsociacion)
              .then(() => { console.log('Eliminado'); return res.status(200).send({ error: false, message: 'Componente eliminado' }) })
              .catch(() => { console.log('Error'); return res.status(400).send({ error: true, message: 'Error' }) })
          }
          if (tipo === constantes.TIPO_COMPONENTE_COMPONENTES) {
            console.log('Eliminar componente componentes')
            await componenteComponentes.eliminarComponenteComponentes(idPagina, idComponente)
            res.status(200).send({ error: false, message: 'Componente eliminado' })
          }
          if (tipo === constantes.TIPO_COMPONENTE_VIDEO) {
            console.log('Eliminar componente VIDEO')
            componente.eliminarComponenteVideo(idPagina, idComponente, tipoAsociacion)
              .then(() => { console.log('Eliminado'); return res.status(200).send({ error: false, message: 'Componente eliminado' }) })
              .catch(() => { console.log('Error'); return res.status(400).send({ error: true, message: 'Error' }) })
          }
          if (tipo === constantes.TIPO_COMPONENTE_GALERIA) {
            console.log('Eliminar componente Galeria')
            componente.eliminarComponenteGaleria(idPagina, idComponente, tipoAsociacion)
              .then(() => { console.log('Eliminado'); return res.status(200).send({ error: false, message: 'Componente eliminado' }) })
              .catch(() => { console.log('Error'); return res.status(400).send({ error: true, message: 'Error' }) })
          }
          if (tipo === constantes.TIPO_COMPONENTE_PAGINAS) {
            console.log('Eliminar componente Paginas')
            componente.eliminarComponentePaginas(idPagina, idComponente, tipoAsociacion)
              .then(() => { console.log('Eliminado'); return res.status(200).send({ error: false, message: 'Componente eliminado' }) })
              .catch(() => { console.log('Error'); return res.status(400).send({ error: true, message: 'Error' }) })
          }
          if (tipo === constantes.TIPO_COMPONENTE_CARUSEL) {
            console.log('Eliminar componente Carusel')
            try {
              await componente.eliminarComponenteCarusel(idPagina, idComponente, tipoAsociacion)
              return res.status(200).send({ error: false, message: 'Componente eliminado' })
            } catch (error) {
              console.log('Error eliminar componente carusel')
              return res.status(400).send({ error: true, message: 'Error al eliminar el componente' })
            }
          }
          if (tipo === constantes.TIPO_COMPONENTE_BLOG) {
            console.log('Eliminar componente Blog')
            try {
              await componenteBlog.eliminarComponenteBlog(idPagina, idComponente, tipoAsociacion)
              return res.status(200).send({ error: false, message: 'Componente eliminado' })
            } catch (error) {
              console.log(error)
              return res.status(400).send({ error: true, message: 'Error al eliminar el componente' })
            }
          }
        }
      )
    }
  )
}

module.exports.registrarComponenteCarrusel = registrarComponenteCarrusel
module.exports.obtenerComponenteCarrusel = obtenerComponenteCarrusel
module.exports.addImagenCarrusel = addImagenCarrusel
module.exports.eliminarImagenCarrusel = eliminarImagenCarrusel
module.exports.actualizarElementosSimultaneos = actualizarElementosSimultaneos

module.exports.registrarComponente = registrarComponente

module.exports.obtenerTipoComponente = obtenerTipoComponente
module.exports.obtenerComponenteTexto = obtenerComponenteTexto
module.exports.obtenerParametro = obtenerParametro
module.exports.obtenerNumeroComponente = obtenerNumeroComponente
module.exports.obtieneOrden = obtieneOrden
module.exports.obtenerComponentes = obtenerComponentes
module.exports.incrementarOrden = incrementarOrden
module.exports.decrementarOrden = decrementarOrden
module.exports.eliminarComponente = eliminarComponente
