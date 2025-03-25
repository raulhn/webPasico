const cancionesEu = require('../logica/canciones_eu.js')
const servletComprobaciones = require('./servlet_comun.js')

function obtenerCanciones (req, res) {
  servletComprobaciones.comprobaciones(req, res,
    async () => {
      const resultado = await cancionesEu.obtener_canciones()
      res.status(200).send({ error: false, canciones: resultado })
    }
  )
}

function obtenerVotaciones (req, res) {
  servletComprobaciones.comprobaciones(req, res,
    async () => {
      const resultado = await cancionesEu.obtener_votaciones()
      res.status(200).send({ error: false, votaciones: resultado })
    }
  )
}

module.exports.obtenerCanciones = obtenerCanciones
module.exports.obtenerVotaciones = obtenerVotaciones
