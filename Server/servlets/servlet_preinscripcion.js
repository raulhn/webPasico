const comun = require('./servlet_comun')
const preinscripcion = require('../logica/preinscripcion')
const constantesEmail = require('../config/email_constantes.js')
const envioEmail = require('../config/envio_email.json')
const respuestaEmail = require('../config/respuesta_email.json')

const sTransporter = require('../logica/transporter.js')

function registrarPreinscripcion (req, res) {
  comun.comprobaciones(req, res,
    async () => {
      const nombre = req.body.nombre
      const primerApellido = req.body.primer_apellido
      const segundoApellido = req.body.segundo_apellido
      const fechaNacimiento = req.body.fecha_nacimiento
      const dni = req.body.dni
      const nombrePadre = req.body.nombre_padre
      const primerApellidoPadre = req.body.primer_apellido_padre
      const segundoApellidoPadre = req.body.segundo_apellido_padre
      const dniPadre = req.body.dni_padre
      const correoElectronico = req.body.correo_electronico
      const telefono = req.body.telefono
      const provincia = req.body.provincia
      const municipio = req.body.municipio
      const direccion = req.body.direccion
      const numero = req.body.numero
      const puerta = req.body.puerta
      const escalera = req.body.escalera
      const codigoPostal = req.body.codigo_postal
      const instrumento = req.body.instrumento
      const familiaInstrumento = req.body.familia_instrumento
      const instrumento2 = req.body.instrumento2
      const familiaInstrumento2 = req.body.familia_instrumento2
      const instrumento3 = req.body.instrumento3
      const familiaInstrumento3 = req.body.familia_instrumento3

      const sucursal = req.body.sucursal
      const curso = req.body.curso
      const horario = req.body.horario
      const tipoInscripcion = req.body.tipo_inscripcion

      const token = req.body.token

      const url = 'https://www.google.com/recaptcha/api/siteverify?secret=' + constantesEmail.CLAVE + '&response=' + token + ''

      const respuesta = await fetch(url, { method: 'post' })
      const respuestaJson = await respuesta.json()

      console.log(url)
      const bSuccess = respuestaJson.success

      if (bSuccess) {
        await preinscripcion.registrarPreinscripcion(nombre, primerApellido, segundoApellido, dni, fechaNacimiento, nombrePadre, primerApellidoPadre,
          segundoApellidoPadre, dniPadre, correoElectronico, telefono, municipio, provincia, direccion, numero, puerta, escalera, codigoPostal, instrumento,
          familiaInstrumento, sucursal, curso, horario, tipoInscripcion, instrumento2, familiaInstrumento2, instrumento3, familiaInstrumento3)

        res.status(200).send({ error: false, message: 'Preinscripcion realizada' })

        await enviarEmail(nombre, primerApellido, segundoApellido, fechaNacimiento)
        await enviarEmailRespuesta(correoElectronico)
      } else {
        res.status(400).send({ error: true, message: 'Error Captcha' })
      }
    }

  )
}

function enviarEmail (nombre, primerApellido, segundoApellido, fechaNacimiento) {
  return new Promise(
    (resolve, reject) => {
      const createTransport = sTransporter.obtenerTransporter()

      envioEmail.html = '<div> <p>Nueva preinscripción realizada</p> <p>Se ha recibido una soliciud para el alumno ' +
            nombre + ' ' + primerApellido + ' ' + segundoApellido + '</p>' +
            '<p> Fecha de nacimiento: ' + fechaNacimiento + ' </div> '

      createTransport.sendMail(envioEmail, function (error, info) {
        if (error) {
          console.log(error)
          console.log('Error al enviar email')
          reject(new Error('Error al enviar email'))
        } else {
          console.log('Correo enviado correctamente')
          resolve()
        }
        createTransport.close()
      })
    }
  )
}

function enviarEmailRespuesta (correo) {
  return new Promise(
    (resolve, reject) => {
      const createTransport = sTransporter.obtenerTransporter()

      respuestaEmail.to = correo

      createTransport.sendMail(respuestaEmail, function (error, info) {
        if (error) {
          console.log(error)
          console.log('Error al enviar email')
          reject(new Error('Error al enviar email'))
        } else {
          console.log('Correo enviado correctamente')
          resolve()
        }
        createTransport.close()
      })
    }
  )
}

function obtenerPreinscripciones (req, res) {
  comun.comprobacionesLogin(req, res,
    async () => {
      const resultados = await preinscripcion.obtenerPreinscripciones()

      res.status(200).send({ error: false, preinscripciones: resultados })
    }

  )
}

function obtenerPreinscripcionesApi (req, res) {
  comun.comprobacionesApi(req, res,
    async () => {
      const resultados = await preinscripcion.obtenerPreinscripciones()

      res.status(200).send({ error: false, preinscripciones: resultados })
    }
  )
}

function obtenerPreinscripcionesDetalle (req, res) {
  comun.comprobacionesApi(req, res,
    async () => {
      const nidPreinscripcion = req.params.nid_preinscripcion

      const resultado = await preinscripcion.obtenerPreincripcionesDetalle(nidPreinscripcion)

      res.status(200).send({ error: false, preinscripciones: resultado })
    }

  )
}

module.exports.obtenerPreinscripciones = obtenerPreinscripciones
module.exports.registrarPreinscripcion = registrarPreinscripcion
module.exports.obtenerPreinscripcionesDetalle = obtenerPreinscripcionesDetalle
module.exports.obtenerPreinscripcionesApi = obtenerPreinscripcionesApi
