const conexion = require('../conexion.js')
const constantes = require('../constantes.js')
const persona = require('./persona.js')
const gestorMatricula = require('./matricula.js')
const parametros = require('./parametros.js')

function obtenerSiguienteLote () {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select ifnull(max(lote), 0) + 1 lote from pasico_gestor.remesa',
        (error, results, fields) => {
          if (error) { console.log(error); reject(new Error('Error al obtener el siguiente lote')) } else { resolve(results[0].lote) }
        })
    }
  )
}

function registrarRemesa (vPersona, vConcepto, vSiguienteLote, vPrecio, vNidFormaPago) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        async () => {
          conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.remesa(nid_forma_pago, nid_persona, concepto, fecha, lote, precio, estado) ' +
           'values(' + conexion.dbConn.escape(vNidFormaPago) + ', ' + conexion.dbConn.escape(vPersona) + ', ' +
 conexion.dbConn.escape(vConcepto) + ' , sysdate(), ' + conexion.dbConn.escape(vSiguienteLote) +
 ', ' + conexion.dbConn.escape(vPrecio) + ", '" + constantes.ESTADO_REMESA_PENDIENTE + "')",
          (error, results, fields) => {
            if (error) { conexion.dbConn.rollback(); console.log(error); reject(new Error('Error al registrar la remesa')) } else { conexion.dbConn.commit(); resolve(results.insertId) }
          })
        }
      )
    }
  )
}

function registrarLineaRemesa (vRemesa, vPrecio, vConcepto) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(
      () => {
        conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.linea_remesa(nid_remesa, concepto, precio) ' +
 'values(' + conexion.dbConn.escape(vRemesa) + ', ' + conexion.dbConn.escape(vConcepto) + ', ' + conexion.dbConn.escape(vPrecio) + ')',
        (error, results, fields) => {
          if (error) { console.log(error); conexion.dbConn.rollback(); reject(new Error('Error al registrar la linea de remesa')) } else { conexion.dbConn.commit(); resolve(results.insertId) }
        })
      }
    )
  }
  )
}

function registrarDescuento (nidRemesa, concepto) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.remesa_descuento(nid_remesa, concepto) values(' +
   conexion.dbConn.escape(nidRemesa) + ', ' + conexion.dbConn.escape(concepto) + ')',
      (error, results, fields) => {
        if (error) { console.log(error); conexion.dbConn.rollback(); reject(new Error('Error al registrar el descuneto')) } else { conexion.dbConn.commit(); resolve() }
      }
      )
    }
  )
}

function obtenerMatriculasActivasFecha (nidSocio, fechaDesde, fechaHasta) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select p.nid nid_persona, m.nid nid_matricula, p.nid_forma_pago ' +
   'from ' + constantes.ESQUEMA_BD + '.matricula m, ' + constantes.ESQUEMA_BD + '.persona p, ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma ' +
   'where m.nid_persona = p.nid ' +
   'and m.nid = ma.nid_matricula ' +
   'and m.nid_curso = (select max(nid) from ' + constantes.ESQUEMA_BD + '.curso) ' +
   'and (nid_persona = ' + conexion.dbConn.escape(nidSocio) + ' or nid_socio = ' + conexion.dbConn.escape(nidSocio) + ') ' +
   ' and (ma.fecha_baja is null or ma.fecha_baja >= ' +
   'str_to_date(nullif(' + conexion.dbConn.escape(fechaDesde) + ', \'\') , \'%Y-%m-%d\')) ' + ' and ' +
   ' ma.fecha_alta <= ' + 'str_to_date(nullif(' + conexion.dbConn.escape(fechaHasta) + ', \'\') , \'%Y-%m-%d\') ' +
   'group by p.nid, m.nid, p.nid_forma_pago ' +
   'order by p.fecha_nacimiento, p.nid',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener las matriculas activas')) } else { resolve(results) }
      }
      )
    }
  )
}

function compruebaEsSocio (nidPersona) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query(" select 'S' " +
   'from ' + constantes.ESQUEMA_BD + '.persona p ' +
   ' where nid = ' + conexion.dbConn.escape(nidPersona) +
   " and (exists (select '1' " +
   ' from ' + constantes.ESQUEMA_BD + '.socios s where s.nid_persona = p.nid) ' +
   " or exists (select '1' from " + constantes.ESQUEMA_BD + '.socios s where s.nid_persona = p.nidSocio))',
      (error, results, fields) => {
        if (error) { console.log(error); reject(error) } else { resolve(results.length > 0) }
      })
    }
  )
}

function obtenerNidSocio (nidPersona) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select nid_persona from ' + constantes.ESQUEMA_BD + '.socios where nid_persona = ' + conexion.dbConn.escape(nidPersona),
        (error, results, fields) => {
          if (error) { console.log(error); reject(error) } else {
            if (results.length > 0) {
              resolve(results[0].nid_persona)
            } else {
              conexion.dbConn.query('select nid_socio from ' + constantes.ESQUEMA_BD + '.persona where nid = ' + conexion.dbConn.escape(nidPersona),
                (error, results, fields) => {
                  if (error) { console.log(error); reject(error) } else { resolve(results[0].nid_socio) }
                })
            }
          }
        })
    }
  )
}

async function asyncPrecioMatricula (nidMatricula, numFamiliar, resolve, reject) {
  let valorRecuperado = await parametros.obtenerValor('REBAJA_VIENTO_CUERDA')
  const REBAJA_VIENTO_CUERDA = valorRecuperado.valor

  valorRecuperado = await parametros.obtenerValor('SUMA_PRECIO_NO_SOCIO')
  const SUMA_PRECIO_NO_SOCIO = valorRecuperado.valor

  valorRecuperado = await parametros.obtenerValor('PRECIO_INSTRUMENTO_BANDA')
  const PRECIO_INSTRUMENTO_BANDA = valorRecuperado.valor

  valorRecuperado = await parametros.obtenerValor('PRECIO_INSTRUMENTO_NO_BANDA')
  const PRECIO_INSTRUMENTO_NO_BANDA = valorRecuperado.valor

  valorRecuperado = await parametros.obtenerValor('PRECIO_LENGUAJE')
  const PRECIO_LENGUAJE = valorRecuperado.valor

  valorRecuperado = await parametros.obtenerValor('PORCENTAJE_DESCUENTO_FAMILIA')
  const PORCENTAJE_FAMILIA = valorRecuperado.valor

  const ASIGNATURA_INSTRUMENTO_BANDA = 1
  const ASIGNATURA_INSTRUMENTO_NO_BANDA = 2
  const ASIGNATURA_LENGUAJE = 0
  const ASIGNATURA_BANDA = 3

  let vPrecioPersona = 0

  let instrumentoBanda = 0
  let instrumentoCuerda = 0

  const asignaturasPrecio = await gestorMatricula.obtenerAsignaturasMatriculaActivas(nidMatricula)
  const datosMatricula = await gestorMatricula.obtenerMatricula(nidMatricula)

  const resumenMatricula = {}
  resumenMatricula.precio = 0
  resumenMatricula.nidMatricula = nidMatricula

  let info = ''

  const descuentos = []
  const lineaRemesas = []

  // Obtiene si es socio //
  const esSocio = await compruebaEsSocio(datosMatricula.nidPersona)

  if (datosMatricula.precioManual != null && datosMatricula.precioManual !== '') {
    const lineaRemesa = {}

    let comentarioManual = datosMatricula.comentarioPrecioManual

    if (comentarioManual === null || comentarioManual === undefined || comentarioManual.length === 0) {
      comentarioManual = ''
    } else {
      comentarioManual = ' - ' + comentarioManual
    }

    lineaRemesa.precio = datosMatricula.precioManual
    lineaRemesa.concepto = 'Precio para el alumno ' + datosMatricula.nombreAlumno + comentarioManual

    lineaRemesas.push(lineaRemesa)

    resumenMatricula.precio = lineaRemesa.precio
  } else {
    for (let z = 0; z < asignaturasPrecio.length; z++) {
      vPrecioPersona = 0
      const lineaRemesa = {}

      const vTipoAsignatura = asignaturasPrecio[z].tipoAsignatura

      if (vTipoAsignatura === ASIGNATURA_INSTRUMENTO_BANDA && esSocio) {
        instrumentoBanda = 1
        vPrecioPersona = PRECIO_INSTRUMENTO_BANDA
        info = 'Precio Instrumento de Banda'
      } else if (vTipoAsignatura === ASIGNATURA_INSTRUMENTO_BANDA && !esSocio) {
        vPrecioPersona = PRECIO_INSTRUMENTO_NO_BANDA
        info = 'Precio Instrumento no de Banda al no estar asociado a un Socio'
      } else if (vTipoAsignatura === ASIGNATURA_INSTRUMENTO_NO_BANDA) {
        instrumentoCuerda = 1
        vPrecioPersona = PRECIO_INSTRUMENTO_NO_BANDA
        info = 'Precio Instrumento no de Banda'
      } else if (vTipoAsignatura === ASIGNATURA_LENGUAJE) {
        vPrecioPersona = PRECIO_LENGUAJE
        info = 'Precio Lenguaje Musical'
      } else if (vTipoAsignatura === ASIGNATURA_BANDA) {
        vPrecioPersona = 0
        info = 'Precio Banda / Conjunto'
      }

      lineaRemesa.precio = vPrecioPersona
      lineaRemesa.concepto = 'Precio para el alumno ' + datosMatricula.nombreAlumno + ' en la asignatura ' + asignaturasPrecio[z].nombreAsignatura + ' (' + info + ')'
      lineaRemesas.push(lineaRemesa)

      resumenMatricula.precio = parseFloat(vPrecioPersona) + parseFloat(resumenMatricula.precio)
    }

    // Descuento por familia //
    if (numFamiliar > 0 && esSocio) {
      const descuentoFamiliar = (parseFloat(PORCENTAJE_FAMILIA) * numFamiliar)
      const numMiembro = numFamiliar + 1
      resumenMatricula.precio = parseFloat(resumenMatricula.precio) * (1 - (descuentoFamiliar / 100))

      descuentos.push('Descuento por familiar ' + descuentoFamiliar + '% ' + numMiembro + 'º miembro')
    }

    // Se comprueba si se añade el extra por no ser socio //
    if (!esSocio) {
      resumenMatricula.precio = parseFloat(resumenMatricula.precio) + parseFloat(SUMA_PRECIO_NO_SOCIO)
      descuentos.push(SUMA_PRECIO_NO_SOCIO + '€ - Precio extra por no ser socio ')
    }

    // Descuento por instrumento de banda y cuerda //
    if (instrumentoBanda && instrumentoCuerda && esSocio) {
      resumenMatricula.precio = parseFloat(resumenMatricula.precio) - parseFloat(REBAJA_VIENTO_CUERDA)
      descuentos.push('-' + REBAJA_VIENTO_CUERDA + '€ - Descuento por instrumento de banda y cuerda')
    }
  }

  resumenMatricula.descuentos = descuentos
  resumenMatricula.lineaRemesas = lineaRemesas

  resolve(resumenMatricula)
}

function precioMatricula (nidMatricula, numFamiliar) {
  return new Promise(
    (resolve, reject) => {
      asyncPrecioMatricula(nidMatricula, numFamiliar, resolve, reject)
    })
}

async function obtenerPrecioMatricuaFecha (nidMatricula, numFamiliar, fechaDesde, fechaHasta, resolve, reject) {
  const vFechaDesdeOriginal = new Date(fechaDesde)
  const vFechaHastaOriginal = new Date(fechaHasta)

  let vFechaDesde = vFechaDesdeOriginal
  let vFechaHasta = vFechaHastaOriginal

  if (vFechaDesde.getMonth() !== vFechaHasta.getMonth() || vFechaDesde.getFullYear() !== vFechaHasta.getFullYear()) {
    reject(new Error('Las fechas desde y hasta son de un mes distinto'))
  }

  const diasMes = new Date(vFechaDesde.getFullYear(), Number(vFechaDesde.getMonth()) + 1, 0).getDate()

  let valorRecuperado = await parametros.obtenerValor('REBAJA_VIENTO_CUERDA')
  const REBAJA_VIENTO_CUERDA = valorRecuperado.valor

  valorRecuperado = await parametros.obtenerValor('SUMA_PRECIO_NO_SOCIO')
  const SUMA_PRECIO_NO_SOCIO = valorRecuperado.valor

  valorRecuperado = await parametros.obtenerValor('PRECIO_INSTRUMENTO_BANDA')
  const PRECIO_INSTRUMENTO_BANDA = valorRecuperado.valor

  valorRecuperado = await parametros.obtenerValor('PRECIO_INSTRUMENTO_NO_BANDA')
  const PRECIO_INSTRUMENTO_NO_BANDA = valorRecuperado.valor

  valorRecuperado = await parametros.obtenerValor('PRECIO_LENGUAJE')
  const PRECIO_LENGUAJE = valorRecuperado.valor

  valorRecuperado = await parametros.obtenerValor('PORCENTAJE_DESCUENTO_FAMILIA')
  const PORCENTAJE_FAMILIA = valorRecuperado.valor

  const ASIGNATURA_INSTRUMENTO_BANDA = 1
  const ASIGNATURA_INSTRUMENTO_NO_BANDA = 2
  const ASIGNATURA_LENGUAJE = 0
  const ASIGNATURA_BANDA = 3

  let vPrecioPersona = 0

  let instrumentoBanda = 0
  let instrumentoCuerda = 0

  const asignaturasPrecio = await gestorMatricula.obtenerAsignaturasMatriculaActivasFecha(nidMatricula, fechaDesde, fechaHasta)
  const datosMatricula = await gestorMatricula.obtenerMatricula(nidMatricula)

  const resumenMatricula = {}
  resumenMatricula.precio = 0
  resumenMatricula.nidMatricula = nidMatricula

  let info = ''

  const descuentos = []
  const lineaRemesas = []

  // Obtiene si es socio //
  const esSocio = await compruebaEsSocio(datosMatricula.nidPersona)

  if (datosMatricula.precioManual != null && datosMatricula.precioManual !== '') {
    const lineaRemesa = {}

    lineaRemesa.precio = datosMatricula.precioManual

    const diferenciaDias = Math.round(((vFechaHasta - vFechaDesde)) / (24 * 3600 * 1000))

    const proporcion = Math.round(Number(diasMes) / 3)
    const vDiferenciaDias = Number(diferenciaDias)

    const vPrecioPersona = Number(lineaRemesa.precio)

    if (proporcion > vDiferenciaDias) {
      // Si lleva menos de un tercio de mes, no se cobra el mes
      lineaRemesa.precio = 0
    } else if ((proporcion * 2) > vDiferenciaDias) {
      // Si lleva menos de dos tercios de mes, se cobra medio mes
      lineaRemesa.precio = vPrecioPersona / 2
    } else {
      lineaRemesa.precio = vPrecioPersona
    }

    let comentarioManual = datosMatricula.comentarioPrecioManual

    if (comentarioManual === null || comentarioManual === undefined || comentarioManual.length === 0) {
      comentarioManual = ''
    } else {
      comentarioManual = ' - ' + comentarioManual
    }

    lineaRemesa.concepto = 'Precio para el alumno ' + datosMatricula.nombreAlumno + comentarioManual

    lineaRemesas.push(lineaRemesa)

    resumenMatricula.precio = vPrecioPersona
  } else {
    for (let z = 0; z < asignaturasPrecio.length; z++) {
      vFechaDesde = vFechaDesdeOriginal
      vFechaHasta = vFechaHastaOriginal

      const vCadenaFechaInicio = asignaturasPrecio[z].fechaAlta
      const vCadenaFechaFin = asignaturasPrecio[z].fechaBaja

      let vFechaFin
      if (vCadenaFechaFin !== null && vCadenaFechaFin !== undefined && vCadenaFechaFin.length > 0) {
        vFechaFin = new Date(vCadenaFechaFin)

        if (vFechaFin < vFechaHasta) {
          vFechaHasta = vFechaFin
        }
      }

      const vFechaInicio = new Date(vCadenaFechaInicio)

      if (vFechaInicio > vFechaDesde) {
        vFechaDesde = vFechaInicio
      }

      vPrecioPersona = 0
      const lineaRemesa = {}

      const vTipoAsignatura = asignaturasPrecio[z].tipoAsignatura

      if (vTipoAsignatura === ASIGNATURA_INSTRUMENTO_BANDA && esSocio) {
        instrumentoBanda = 1
        vPrecioPersona = PRECIO_INSTRUMENTO_BANDA
        info = 'Precio Instrumento de Banda'
      } else if (vTipoAsignatura === ASIGNATURA_INSTRUMENTO_BANDA && !esSocio) {
        vPrecioPersona = PRECIO_INSTRUMENTO_NO_BANDA
        info = 'Precio Instrumento no de Banda al no estar asociado a un Socio'
      } else if (vTipoAsignatura === ASIGNATURA_INSTRUMENTO_NO_BANDA) {
        instrumentoCuerda = 1
        vPrecioPersona = PRECIO_INSTRUMENTO_NO_BANDA
        info = 'Precio Instrumento no de Banda'
      } else if (vTipoAsignatura === ASIGNATURA_LENGUAJE) {
        vPrecioPersona = PRECIO_LENGUAJE
        info = 'Precio Lenguaje Musical'
      } else if (vTipoAsignatura === ASIGNATURA_BANDA) {
        vPrecioPersona = 0
        info = 'Precio Banda / Conjunto'
      }

      const diferenciaDias = Math.round(((vFechaHasta - vFechaDesde)) / (24 * 3600 * 1000))

      const proporcion = Math.round(Number(diasMes) / 3)
      const vDiferenciaDias = Number(diferenciaDias)

      if (proporcion > vDiferenciaDias) {
        // Si lleva menos de un tercio de mes, no se cobra el mes
        lineaRemesa.precio = 0
      } else if ((proporcion * 2) > vDiferenciaDias) {
        // Si lleva menos de dos tercios de mes, se cobra medio mes
        lineaRemesa.precio = vPrecioPersona / 2
      } else {
        lineaRemesa.precio = vPrecioPersona
      }

      lineaRemesa.concepto = 'Precio para el alumno ' + datosMatricula.nombreAlumno + ' en la asignatura ' + asignaturasPrecio[z].nombreAsignatura + ' (' + info + ')'
      lineaRemesas.push(lineaRemesa)

      resumenMatricula.precio = parseFloat(vPrecioPersona) + parseFloat(resumenMatricula.precio)
    }

    // Descuento por familia //
    if (numFamiliar > 0 && esSocio) {
      const descuentoFamiliar = (parseFloat(PORCENTAJE_FAMILIA) * numFamiliar)
      const numMiembro = numFamiliar + 1
      resumenMatricula.precio = parseFloat(resumenMatricula.precio) * (1 - (descuentoFamiliar / 100))

      descuentos.push('Descuento por familiar ' + descuentoFamiliar + '% ' + numMiembro + 'º miembro')
    }

    // Se comprueba si se añade el extra por no ser socio //
    if (!esSocio) {
      resumenMatricula.precio = parseFloat(resumenMatricula.precio) + parseFloat(SUMA_PRECIO_NO_SOCIO)
      descuentos.push(SUMA_PRECIO_NO_SOCIO + '€ - Precio extra por no ser socio ')
    }

    // Descuento por instrumento de banda y cuerda //
    if (instrumentoBanda && instrumentoCuerda && esSocio) {
      resumenMatricula.precio = parseFloat(resumenMatricula.precio) - parseFloat(REBAJA_VIENTO_CUERDA)
      descuentos.push('-' + REBAJA_VIENTO_CUERDA + '€ - Descuento por instrumento de banda y cuerda')
    }
  }

  resumenMatricula.descuentos = descuentos
  resumenMatricula.lineaRemesas = lineaRemesas
}

function precioMatriculaFecha (nidMatricula, numFamiliar, fechaDesde, fechaHasta) {
  return new Promise(
    (resolve, reject) => {
      try {
        obtenerPrecioMatricuaFecha(nidMatricula, numFamiliar, fechaDesde, fechaHasta, resolve, reject)
      } catch (error) { console.log(error); reject(new Error('Error al recuperar el precio de la mensualidad')) }
    }
  )
}

function eliminarDescuentoLote (vLote) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.remesa_descuento ' +
   ' where nid_remesa in (select nid_remesa from ' + constantes.ESQUEMA_BD +
   '.remesa where lote = ' + conexion.dbConn.escape(vLote) + ')',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al eliminar el descuento')) } else { resolve() }
      }
      )
    }
  )
}

function eliminarLineaRemesaLote (vLote) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.linea_remesa ' +
                        ' where nid_remesa in (select nid_remesa from ' + constantes.ESQUEMA_BD +
                        '.remesa where lote = ' + conexion.dbConn.escape(vLote) + ')',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al eliminar linea de remesa')) } else { resolve() }
      }
      )
    }
  )
}

function limpiarLote (vLote) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        async () => {
          try {
            await eliminarDescuentoLote(vLote)
            await eliminarLineaRemesaLote(vLote)
            conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.remesa ' +
  ' where lote = ' + conexion.dbConn.escape(vLote),
            (error, results, fields) => {
              if (error) { console.log(error); reject(new Error('Error al limpiar el lote')); conexion.dbConn.rollback() } else { conexion.dbConn.commit(); resolve() }
            }
            )
          } catch (error) {
            conexion.dbConn.rollback()
            reject(new Error('Error al limpiar el lote'))
          }
        }
      )
    }
  )
}

async function asyncRegistrarRemesaMatriculasFecha (vConcepto, fechaDesde, fechaHasta, resolve, reject) {
  try {
    const personasMatriculaActiva = await gestorMatricula.obtenerPersonasMatriculaActivaFecha(fechaDesde, fechaHasta)
    const vSiguienteLote = await obtenerSiguienteLote()
    for (let i = 0; i < personasMatriculaActiva.length; i++) {
      const nidMatricula = personasMatriculaActiva[i].nidMatricula

      await registrarRemesaPersonaFecha(nidMatricula, vConcepto, vSiguienteLote, fechaDesde, fechaHasta)
    }

    resolve()
  } catch (error) {
    console.log(error)
    reject(new Error('Error al registrar la remesa'))
  }
}

function registrarRemesaMatriculasFecha (vConcepto, fechaDesde, fechaHasta) {
  return new Promise(
    (resolve, reject) => {
      asyncRegistrarRemesaMatriculasFecha(vConcepto, fechaDesde, fechaHasta, resolve, reject)
    }
  )
}

async function asyncRegistrarRemesaPersonaFecha (nidMatricula, vConcepto, lote, fechaDesde, fechaHasta, resolve, reject) {
  try {
    const vMatricula = await gestorMatricula.obtenerMatricula(nidMatricula)
    const nidPersona = vMatricula.nidPersona

    const bEsSocio = await compruebaEsSocio(nidPersona)
    const personaRecuperada = await persona.obtenerPersona(nidPersona)

    if (bEsSocio) {
      const nidSocio = await obtenerNidSocio(nidPersona)
      const vPersonasActivas = await obtenerMatriculasActivasFecha(nidSocio, fechaDesde, fechaHasta)

      let vResumenMatricula = null

      if (vPersonasActivas !== undefined) {
        if (vPersonasActivas.length > 0) {
          for (let i = 0; i < vPersonasActivas.length; i++) {
            if (vPersonasActivas[i].nidMatricula === nidMatricula) {
              vResumenMatricula = await precioMatriculaFecha(nidMatricula, i, fechaDesde, fechaHasta)
              const vPrecioRemesa = vResumenMatricula.precio
              const nidRemesa = await registrarRemesa(personaRecuperada.nid, vConcepto, lote, vPrecioRemesa, personaRecuperada.nidFormaPago)

              for (let z = 0; z < vResumenMatricula.lineaRemesas.length; z++) {
                await registrarLineaRemesa(nidRemesa, vResumenMatricula.lineaRemesas[z].precio, vResumenMatricula.lineaRemesas[z].concepto)
              }

              for (let z = 0; z < vResumenMatricula.descuentos.length; z++) {
                await registrarDescuento(nidRemesa, vResumenMatricula.descuentos[z])
              }
              resolve()
            }
          }
        } else {
          console.log('remesa.js - registrarRemesaPersonaFecha -> No se han encontrado personas activas para el socio ' + nidSocio)
          reject(new Error('No se ha podido registrar la remesa'))
        }
      } else {
        console.log('remesa.js - registrarRemesaPersonaFecha -> No se han encontrado personas')
        reject(new Error('No se ha podido registrar la remesa'))
      }
    } else {
      const vResumenMatricula = await precioMatriculaFecha(nidMatricula, 0, fechaDesde, fechaHasta)
      const vPrecioRemesa = vResumenMatricula.precio
      const nidRemesa = await registrarRemesa(personaRecuperada.nid, vConcepto, lote, vPrecioRemesa, personaRecuperada.nidFormaPago)

      for (let z = 0; z < vResumenMatricula.lineaRemesas.length; z++) {
        await registrarLineaRemesa(nidRemesa, vResumenMatricula.lineaRemesas[z].precio, vResumenMatricula.lineaRemesas[z].concepto)
      }

      for (let z = 0; z < vResumenMatricula.descuentos.length; z++) {
        await registrarDescuento(nidRemesa, vResumenMatricula.descuentos[z])
      }
      resolve()
    }
  } catch (error) {
    console.log('remesa.js - registrarRemesaPersonaFecha -> ' + error)
    reject(new Error('Error al registrar la remesa'))
  }
}

function registrarRemesaPersonaFecha (nidMatricula, vConcepto, lote, fechaDesde, fechaHasta) {
  return new Promise(
    (resolve, reject) => {
      asyncRegistrarRemesaPersonaFecha(nidMatricula, vConcepto, lote, fechaDesde, fechaHasta, resolve, reject)
    }
  )
}

function obtenerRemesas (fechaDesde, fechaHasta) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select r.nid_remesa, r.nid_forma_pago, r.nid_persona, r.concepto, r.lote, r.precio, r.estado, r.anotaciones, r.nid_cobro_pasarela_pago ' +
 ", DATE_FORMAT(r.fecha, '%d/%m/%Y') fecha, p.*, fp.iban " +
 'from ' + constantes.ESQUEMA_BD + '.remesa r, ' + constantes.ESQUEMA_BD + '.persona p, ' +
 constantes.ESQUEMA_BD + '.forma_pago fp ' +
 'where r.fecha >= str_to_date(nullif(' + conexion.dbConn.escape(fechaDesde) + ', \'\') , \'%Y-%m-%d\') ' +
 'and r.fecha <= str_to_date(nullif(' + conexion.dbConn.escape(fechaHasta) + ', \'\') , \'%Y-%m-%d\') ' +
 'and p.nid = r.nid_persona ' +
 'and fp.nid = p.nid_forma_pago ',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener las remesas')) } else { resolve(results) }
      }
      )
    }
  )
}

function obtenerRemesa (lote) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select r.nid_remesa, r.nid_forma_pago, r.nid_persona, r.concepto, r.lote, r.precio, r.estado, r.anotaciones, r.nid_cobro_pasarela_pago ' +
 ", DATE_FORMAT(r.fecha, '%d/%m/%Y') fecha, " +
 'fp.iban, concat(p.nombre, \' \', p.primer_apellido, \' \', p.segundo_apellido) etiqueta_nombre from ' +
 constantes.ESQUEMA_BD + '.remesa r, ' + constantes.ESQUEMA_BD + '.forma_pago fp, ' + constantes.ESQUEMA_BD + '.persona p ' +
 ' where r.nid_forma_pago = fp.nid and lote = ' + conexion.dbConn.escape(lote) +
 ' and r.nid_persona = p.nid',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener la remesa')) } else { resolve(results) }
      }
      )
    }
  )
}

function obtenerRemesaPendiente (lote) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select r.nid_remesa, r.nid_forma_pago, r.nid_persona, r.concepto, r.lote, r.precio, r.estado, r.anotaciones, r.nid_cobro_pasarela_pago ' +
  ", DATE_FORMAT(r.fecha, '%d/%m/%Y') fecha from " + constantes.ESQUEMA_BD +
  '.remesa r where r.lote = ' + conexion.dbConn.escape(lote) +
  " and r.estado = '" + constantes.ESTADO_REMESA_PENDIENTE + "'",
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener las remesas pendientes')) } else { resolve(results) }
      }
      )
    }
  )
}

function obtenerRemesaEstado (lote, estado) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select r.nid_remesa, r.nid_forma_pago, r.nid_persona, r.concepto, r.lote, r.precio, r.estado, r.anotaciones, r.nid_cobro_pasarela_pago ' +
 ", DATE_FORMAT(r.fecha, '%d/%m/%Y') fecha from " + constantes.ESQUEMA_BD +
 '.remesa r where lote = ' + conexion.dbConn.escape(lote) +
 ' and estado = ' + conexion.dbConn.escape(estado),
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener las remesas')) } else { resolve(results) }
      }
      )
    }
  )
}

function obtenerLineasRemesa (nidRemesa) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.linea_remesa where nid_remesa = ' +
 conexion.dbConn.escape(nidRemesa),
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener las lineeas de remesa')) } else { resolve(results) }
      })
    }
  )
}

function obtenerDescuentosRemesa (nidRemesa) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.remesa_descuento where nid_remesa = ' +
 conexion.dbConn.escape(nidRemesa),
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener los descuentos de las remesas')) } else { resolve(results) }
      })
    }
  )
}

async function asyncObtenerPrecioMatriculaFecha (nidMatricula, fechaDesde, fechaHasta, resolve, reject) {
  try {
    const vMatricula = await gestorMatricula.obtenerMatricula(nidMatricula)
    const nidPersona = vMatricula.nidPersona

    // Comprueba si es socio o tiene un socio asociado //
    const bEsSocio = await compruebaEsSocio(nidPersona)
    let vResumenMatricula = null

    if (bEsSocio) {
      const nidSocio = await obtenerNidSocio(nidPersona)
      const vPersonasActivas = await obtenerMatriculasActivasFecha(nidSocio, fechaDesde, fechaHasta)

      if (vPersonasActivas !== undefined) {
        for (let i = 0; i < vPersonasActivas.length; i++) {
          if (vPersonasActivas[i].nidMatricula === nidMatricula) {
            vResumenMatricula = await precioMatriculaFecha(nidMatricula, i, fechaDesde, fechaHasta)
            resolve(vResumenMatricula)
          }
        }
      }
    } else {
      vResumenMatricula = await precioMatricula(nidMatricula, 0)
      resolve(vResumenMatricula)
    }
  } catch (error) {
    console.log(error)
    reject(new Error('Error al recupera el precio de la matricula'))
  }
}

function obtenerPrecioMatriculaFecha (nidMatricula, fechaDesde, fechaHasta) {
  return new Promise(
    (resolve, reject) => {
      asyncObtenerPrecioMatriculaFecha(nidMatricula, fechaDesde, fechaHasta, resolve, reject)
    }
  )
}

function obtenerUltimoLote () {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select ifnull(max(lote), 0) ultimo_lote from ' + constantes.ESQUEMA_BD + '.remesa',
        (error, results, fields) => {
          if (error) { console.log(error); reject(new Error('Error al obtener el último lote')) } else { resolve(results[0].ultimo_lote) }
        }
      )
    }
  )
}

function obtenerRemesaNid (nidRemesa) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select r.nid_remesa, r.nid_forma_pago, r.nid_persona, r.concepto, r.lote, r.precio, r.estado, r.anotaciones, r.nid_cobro_pasarela_pago ' +
 ", DATE_FORMAT(r.fecha, '%d/%m/%Y') fecha from " + constantes.ESQUEMA_BD +
 '.remesa r where nid_remesa = ' + conexion.dbConn.escape(nidRemesa),
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener la remesa')) } else { resolve(results) }
      }
      )
    }
  )
}

async function asyncObtenerConcepto (nidRemesa, resolve, reject) {
  const vRemesa = await obtenerRemesaNid(nidRemesa)

  const concepto = vRemesa.concepto

  resolve(concepto)
}
function obtenerConcepto (nidRemesa) {
  return new Promise(
    (resolve, reject) => {
      asyncObtenerConcepto(nidRemesa, resolve, reject)
    }
  )
}

function actualizarEstado (nidRemesa, estado, anotaciones) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () =>
          conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.remesa set estado = ' + conexion.dbConn.escape(estado) +
 ', anotaciones = ' + conexion.dbConn.escape(anotaciones) +
 ' where nid_remesa = ' + conexion.dbConn.escape(nidRemesa),
          (error, results, fields) => {
            if (error) { console.log(error); conexion.dbConn.rollback(); reject(new Error('Error al actualizar el estado')) } else { conexion.dbConn.commit(); resolve() }
          }
          )
      )
    }
  )
}

async function asyncAprobarRemesas (lote, anotaciones, resolve, reject) {
  try {
    const remesas = await obtenerRemesaPendiente(lote)

    for (let i = 0; i < remesas.length; i++) {
      await actualizarEstado(remesas[i].nid_remesa, constantes.ESTADO_REMESA_PAGADO, anotaciones)
    }
    resolve()
  } catch (error) {
    console.log('remesa.js - aprobarRemesas -> ' + error)
    reject(new Error('Error al aprobar las remesas'))
  }
}

function aprobarRemesas (lote, anotaciones) {
  return new Promise(
    (resolve, reject) => {
      asyncAprobarRemesas(lote, anotaciones, resolve, reject)
    }
  )
}

async function asyncRechazarRemesas (nidRemesa, anotaciones, resolve, reject) {
  try {
    await actualizarEstado(nidRemesa, constantes.ESTADO_REMESA_RECHAZADO, anotaciones)
    resolve()
  } catch (error) {
    console.log('remesa.js - rechazarRemesa -> ' + error)
    reject(new Error('Error al rechazar la remesa'))
  }
}

function rechazarRemesa (nidRemesa, anotaciones) {
  return new Promise(
    (resolve, reject) => {
      asyncRechazarRemesas(nidRemesa, anotaciones, resolve, reject)
    }
  )
}

async function asyncAprobarRemesa (nidRemesa, anotaciones, resolve, reject) {
  try {
    await actualizarEstado(nidRemesa, constantes.ESTADO_REMESA_PAGADO, anotaciones)
    resolve()
  } catch (error) {
    console.log('remesa.js - aprobarRemesa -> ' + error)
    reject(new Error('Error al aprobar la remesa'))
  }
}

async function aprobarRemesa (nidRemesa, anotaciones) {
  return new Promise(
    (resolve, reject) => {
      asyncAprobarRemesa(nidRemesa, anotaciones, resolve, reject)
    }
  )
}

async function asyncRemesaErronea (nidRemesa, anotaciones, resolve, reject) {
  try {
    await actualizarEstado(nidRemesa, constantes.ESTADO_REMESA_ERRONEO, anotaciones)
    resolve()
  } catch (error) {
    console.log('remesa.js - remesaErronea -> ' + error)
    reject(new Error('Error al aprobar la remesa'))
  }
}

async function remesaErronea (nidRemesa, anotaciones) {
  return new Promise(
    (resolve, reject) => {
      asyncRemesaErronea(nidRemesa, anotaciones, resolve, reject)
    }
  )
}

function actualizarIdCobroPasarelaPago (nidRemesa, nidCobroPasarela) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.remesa set nid_cobro_pasarela_pago = ' + conexion.dbConn.escape(nidCobroPasarela) +
 ' where nid_remesa = ' + conexion.dbConn.escape(nidRemesa),
          (error, results, fields) => {
            if (error) { console.log('remesa.js - actualizarIdCobroPasarelaPago -> ' + error); conexion.dbConn.rollback(); reject(new Error('Error al actualizar el cobro')) } else { conexion.dbConn.commit(); resolve() }
          })
        }
      )
    }
  )
}

function actualizarRemesa (nidRemesa, precio, concepto, estado) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.remesa set precio = ' + conexion.dbConn.escape(precio) +
 ', concepto = ' + conexion.dbConn.escape(concepto) + ', estado = ' + conexion.dbConn.escape(estado) +
 ' where nid_remesa = ' + conexion.dbConn.escape(nidRemesa),
      (error, results, fields) => {
        if (error) {
          console.log(error)
          reject(new Error('Error al actualizar la remesa'))
        } else { resolve() }
      }
      )
    }
  )
}

function actualizarLineaRemesa (nidLineaRemesa, concepto, precio) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.linea_remesa set concepto = ' + conexion.dbConn.escape(concepto) +
 ', precio = ' + conexion.dbConn.escape(precio) +
 ' where nid_linea_remesa = ' + conexion.dbConn.escape(nidLineaRemesa),
      (error, results, fields) => {
        if (error) {
          console.log(error)
          reject(new Error('Error al actualizar la linea de remesa'))
        } else { resolve() }
      }
      )
    }
  )
}

function actualizarRemesaDescuento (nidRemesaDescuento, concepto) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.remesa_descuento set concepto = ' + conexion.dbConn.escape(concepto) +
 ' where nid_remesa_descuento = ' + conexion.dbConn.escape(nidRemesaDescuento),
      (error, results, fields) => {
        if (error) {
          console.log(error)
          reject(new Error('Error al actualizar el descuento'))
        } else { resolve() }
      }
      )
    }
  )
}

function actualizacionRemesa (vRemesa, vLineaRemesa, vDescuentoRemesa) {
  return new Promise(
    (resolve, reject) => {
      try {
        conexion.dbConn.beginTransaction(
          async () => {
            await actualizarRemesa(vRemesa.nid_remesa, vRemesa.precio, vRemesa.concepto, vRemesa.estado)

            for (let i = 0; i < vLineaRemesa.length; i++) {
              await actualizarLineaRemesa(vLineaRemesa[i].nid_linea_remesa, vLineaRemesa[i].concepto, vLineaRemesa[i].precio)
            }

            for (let i = 0; i < vDescuentoRemesa; i++) {
              await actualizarRemesaDescuento(vDescuentoRemesa[i].nid_descuento_remesa, vDescuentoRemesa[i].concepto)
            }

            conexion.dbConn.commit()
            resolve()
          })
      } catch (error) {
        conexion.dbConn.rollback()
        console.log('remesa.js - actualizacionRemesa -> ' + error)
        reject(new Error('Error al actualizar la remesa'))
      }
    }
  )
}

function nuevaLineaRemesa (nidRemesa, concepto, precio) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.linea_remesa (nid_remesa, concepto, precio) values (' +
 conexion.dbConn.escape(nidRemesa) + ', ' + conexion.dbConn.escape(concepto) + ', ' + conexion.dbConn.escape(precio) + ')',
          (error, results, fields) => {
            if (error) {
              console.log('remesa.js - nuevaLineaRemesa -> ' + error); conexion.dbConn.rollback()
              reject(new Error('Error al registrar la linea de remesa'))
            } else { conexion.dbConn.commit(); resolve() }
          }
          )
        }
      )
    }
  )
}

function nuevoDescuentoRemesa (nidRemesa, concepto) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.remesa_descuento (nid_remesa, concepto) values (' +
    conexion.dbConn.escape(nidRemesa) + ', ' + conexion.dbConn.escape(concepto) + ')',
          (error, results, fields) => {
            if (error) {
              console.log('remesa.js - nuevoDescuentoRemesa -> ' + error); conexion.dbConn.rollback()
              reject(new Error('Error al registrar el descuento'))
            } else { conexion.dbConn.commit(); resolve() }
          }
          )
        }
      )
    }
  )
}

function eliminarLineaRemesa (nidLineaRemesa) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.linea_remesa where nid_linea_remesa = ' + conexion.dbConn.escape(nidLineaRemesa),
            (error, results, fields) => {
              if (error) {
                console.log('remesa.js - eliminarLineaRemesa -> ' + error); conexion.dbConn.rollback()
                reject(new Error('Error al eliminar la linea de remesa'))
              } else { conexion.dbConn.commit(); resolve() }
            }
          )
        })
    }
  )
}

function eliminarDescuentoRemesa (nidDescuentoRemesa) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.remesa_descuento where nid_remesa_descuento = ' + conexion.dbConn.escape(nidDescuentoRemesa),
            (error, results, fields) => {
              if (error) {
                console.log('remesa.js - eliminarDescuentoRemesa -> ' + error); conexion.dbConn.rollback()
                reject(new Error('Error al eliminar el descuento'))
              } else { conexion.dbConn.commit(); resolve() }
            }
          )
        })
    }
  )
}

module.exports.registrarRemesa = registrarRemesa
module.exports.registrarRemesaMatriculasFecha = registrarRemesaMatriculasFecha

module.exports.obtenerRemesas = obtenerRemesas

module.exports.obtenerRemesa = obtenerRemesa
module.exports.obtenerRemesaEstado = obtenerRemesaEstado

module.exports.obtenerLineasRemesa = obtenerLineasRemesa
module.exports.obtenerDescuentosRemesa = obtenerDescuentosRemesa
module.exports.obtenerUltimoLote = obtenerUltimoLote
module.exports.obtenerRemesaNid = obtenerRemesaNid

module.exports.obtenerConcepto = obtenerConcepto

module.exports.aprobarRemesas = aprobarRemesas
module.exports.rechazarRemesa = rechazarRemesa
module.exports.aprobarRemesa = aprobarRemesa
module.exports.remesaErronea = remesaErronea

module.exports.actualizarIdCobroPasarelaPago = actualizarIdCobroPasarelaPago

module.exports.obtenerPrecioMatriculaFecha = obtenerPrecioMatriculaFecha

module.exports.actualizacionRemesa = actualizacionRemesa

module.exports.nuevaLineaRemesa = nuevaLineaRemesa
module.exports.nuevoDescuentoRemesa = nuevoDescuentoRemesa

module.exports.eliminarLineaRemesa = eliminarLineaRemesa
module.exports.eliminarDescuentoRemesa = eliminarDescuentoRemesa

module.exports.limpiarLote = limpiarLote
