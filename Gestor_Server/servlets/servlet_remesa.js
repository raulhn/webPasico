const constantes = require('../constantes.js')
const comun = require('./servlet_comun.js')
const remesa = require('../logica/remesa.js')

function registrar_remesa_persona (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const nid = req.body.nid
      const v_siguiente_lote = await remesa.obtener_siguiente_lote()
      await remesa.registrar_remesa_persona(nid, v_siguiente_lote)

      res.status(200).send({ error: false, message: 'Registra remesa' })
    }
  )
}

function registrar_remesa_matriculas (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const concepto = req.body.concepto
      await remesa.registrar_remesa_matriculas(concepto)
      res.status(200).send({ error: false, message: 'Registra remesa' })
    }

  )
}

function registrar_remesa_matriculas_fecha (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const fecha_desde = req.body.fecha_desde
      const fecha_hasta = req.body.fecha_hasta
      const concepto = req.body.concepto

      await remesa.registrar_remesa_matriculas_fecha(concepto, fecha_desde, fecha_hasta)
      res.status(200).send({ error: false, message: 'Registra remesa' })
    }

  )
}

function obtener_remesas (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const fecha_desde = req.body.fecha_desde
      const fecha_hasta = req.body.fecha_hasta

      const remesas = await remesa.obtener_remesas(fecha_desde, fecha_hasta)

      res.status(200).send({ error: false, remesas })
    }

  )
}

function obtener_mensualidad (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const nid_matricula = req.params.nid_matricula

      const fecha = new Date()
      const diasMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate()

      const mes = Number(fecha.getMonth()) + 1
      const fecha_desde = new Date(fecha.getFullYear() + '-' + mes + '-' + 1)
      const fecha_hasta = new Date(fecha.getFullYear() + '-' + mes + '-' + diasMes)

      const v_resumen_matricula = await remesa.obtener_precio_matricula_fecha(nid_matricula, fecha_desde, fecha_hasta)

      res.status(200).send({ error: false, resumen_mensualidad: v_resumen_matricula })
    }

  )
}

function obtener_mensualidad_fecha (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const nid_matricula = req.params.nid_matricula
      const fecha_desde = req.params.fecha_desde
      const fecha_hasta = req.params.fecha_hasta
      const v_resumen_matricula = await remesa.obtener_precio_matricula_fecha(nid_matricula, fecha_desde, fecha_hasta)

      res.status(200).send({ error: false, resumen_mensualidad: v_resumen_matricula })
    }

  )
}

function obtener_remesa (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const lote = req.params.lote
      const remesas = await remesa.obtener_remesa(lote)

      res.status(200).send({ error: false, remesas })
    }

  )
}

function obtener_remesa_estado (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const lote = req.params.lote
      const estado = req.params.estado

      const remesas = await remesa.obtener_remesa_estado(lote, estado)
      res.status(200).send({ error: false, remesas })
    }

  )
}

function obtener_lineas_remesa (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const nid_remesa = req.params.nid_remesa

      const lineas_remesa = await remesa.obtener_lineas_remesa(nid_remesa)

      res.status(200).send({ error: false, lineas_remesa })
    }

  )
}

function obtener_concepto (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const nid_remesa = req.params.nid_remesa
      const concepto = await remesa.obtener_concepto(nid_remesa)

      res.status(200).send({ error: false, concepto })
    }
  )
}

function obtener_descuentos_remesa (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const nid_remesa = req.params.nid_remesa

      const descuentos = await remesa.obtener_descuentos_remesa(nid_remesa)

      res.status(200).send({ error: false, descuentos_remesa: descuentos })
    }
  )
}

function obtener_ultimo_lote (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const ultimo_lote = await remesa.obtener_ultimo_lote()

      res.status(200).send({ error: false, ultimo_lote })
    }

  )
}

function obtener_remesa_nid (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const nid_remesa = req.params.nid_remesa

      const remesa_recuperada = await remesa.obtener_remesa_nid(nid_remesa)

      res.status(200).send({ error: false, remesa: remesa_recuperada })
    }
  )
}

function aprobar_remesa (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const nid_remesa = req.body.nid_remesa
      const anotaciones = req.body.anotaciones

      await remesa.aprobar_remesa(nid_remesa, anotaciones)
      res.status(200).send({ error: false, message: 'Recibo aprobado' })
    }
  )
}

function rechazar_remesa (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const nid_remesa = req.body.nid_remesa
      const anotaciones = req.body.anotaciones

      await remesa.rechazar_remesa(nid_remesa, anotaciones)
      res.status(200).send({ error: false, message: 'Recibo rechazado' })
    }
  )
}

function aprobar_remesas (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const lote = req.body.lote
      const anotaciones = req.body.anotaciones

      await remesa.aprobar_remesas(lote, anotaciones)
      res.status(200).send({ error: false, message: 'Lote aprobado' })
    }
  )
}

function actualizar_remesa (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const v_remesa = JSON.parse(req.body.remesa)
      const v_linea_remesa = JSON.parse(req.body.linea_remesa)
      const v_descuentos_remesas = JSON.parse(req.body.descuento_remesa)

      await remesa.actualizacion_remesa(v_remesa, v_linea_remesa, v_descuentos_remesas)
      res.status(200).send({ error: false, message: 'Recibo actualizado' })
    }
  )
}

function nueva_linea_remesa (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const v_nid_remesa = req.body.nid_remesa
      const v_concepto = req.body.concepto
      const v_precio = req.body.precio

      await remesa.nueva_linea_remesa(v_nid_remesa, v_concepto, v_precio)
      res.status(200).send({ error: false, message: 'Nueva línea de recibo' })
    }
  )
}

function nuevo_descuento_remesa (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const v_nid_remesa = req.body.nid_remesa
      const v_concepto = req.body.concepto

      await remesa.nuevo_descuento_remesa(v_nid_remesa, v_concepto)
      res.status(200).send({ error: false, message: 'Nuevo descuento de recibo' })
    }
  )
}

function eliminar_linea_remesa (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const v_nid_linea_remesa = req.body.nid_linea_remesa

      await remesa.eliminar_linea_remesa(v_nid_linea_remesa)
      res.status(200).send({ error: false, message: 'Línea de recibo eliminada' })
    }
  )
}

function eliminar_descuento_remesa (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const v_nid_descuento_remesa = req.body.nid_descuento_remesa

      await remesa.eliminar_descuento_remesa(v_nid_descuento_remesa)
      res.status(200).send({ error: false, message: 'Descuento de recibo eliminado' })
    }
  )
}

module.exports.registrar_remesa_persona = registrar_remesa_persona
module.exports.obtener_remesas = obtener_remesas
module.exports.obtener_mensualidad = obtener_mensualidad
module.exports.obtener_mensualidad_fecha = obtener_mensualidad_fecha

module.exports.obtener_remesa = obtener_remesa
module.exports.obtener_remesa_estado = obtener_remesa_estado
module.exports.obtener_lineas_remesa = obtener_lineas_remesa
module.exports.obtener_concepto = obtener_concepto
module.exports.obtener_descuentos_remesa = obtener_descuentos_remesa
module.exports.obtener_remesa_nid = obtener_remesa_nid

module.exports.obtener_ultimo_lote = obtener_ultimo_lote

module.exports.rechazar_remesa = rechazar_remesa
module.exports.aprobar_remesa = aprobar_remesa
module.exports.aprobar_remesas = aprobar_remesas

module.exports.registrar_remesa_matriculas = registrar_remesa_matriculas
module.exports.registrar_remesa_matriculas_fecha = registrar_remesa_matriculas_fecha

module.exports.actualizar_remesa = actualizar_remesa
module.exports.nueva_linea_remesa = nueva_linea_remesa
module.exports.nuevo_descuento_remesa = nuevo_descuento_remesa

module.exports.eliminar_linea_remesa = eliminar_linea_remesa
module.exports.eliminar_descuento_remesa = eliminar_descuento_remesa
