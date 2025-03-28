const comun = require("./servlet_comun");
const preinscripcion = require("../logica/preinscripcion");
const constantes_email = require("../config/email_constantes.js");
const envio_email = require("../config/envio_email.json");
var respuesta_email = require("../config/respuesta_email.json");

const s_transporter = require("../logica/transporter.js");

function registrar_preinscripcion(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nombre = req.body.nombre;
    let primer_apellido = req.body.primer_apellido;
    let segundo_apellido = req.body.segundo_apellido;
    let fecha_nacimiento = req.body.fecha_nacimiento;
    let dni = req.body.dni;
    let nombre_padre = req.body.nombre_padre;
    let primer_apellido_padre = req.body.primer_apellido_padre;
    let segundo_apellido_padre = req.body.segundo_apellido_padre;
    let dni_padre = req.body.dni_padre;
    let correo_electronico = req.body.correo_electronico;
    let telefono = req.body.telefono;
    let provincia = req.body.provincia;
    let municipio = req.body.municipio;
    let direccion = req.body.direccion;
    let numero = req.body.numero;
    let puerta = req.body.puerta;
    let escalera = req.body.escalera;
    let codigo_postal = req.body.codigo_postal;
    let instrumento = req.body.instrumento;
    let familia_instrumento = req.body.familia_instrumento;
    let instrumento2 = req.body.instrumento2;
    let familia_instrumento2 = req.body.familia_instrumento2;
    let instrumento3 = req.body.instrumento3;
    let familia_instrumento3 = req.body.familia_instrumento3;

    let sucursal = req.body.sucursal;
    let curso = req.body.curso;
    let horario = req.body.horario;
    let tipo_inscripcion = req.body.tipo_inscripcion;

    let token = req.body.token;

    const url =
      "https://www.google.com/recaptcha/api/siteverify?secret=" +
      constantes_email.CLAVE +
      "&response=" +
      token +
      "";

    let respuesta = await fetch(url, { method: "post" });
    let respuesta_json = await respuesta.json();

    let bSuccess = respuesta_json.success;

    if (bSuccess) {
      await preinscripcion.registrar_preinscripcion(
        nombre,
        primer_apellido,
        segundo_apellido,
        dni,
        fecha_nacimiento,
        nombre_padre,
        primer_apellido_padre,
        segundo_apellido_padre,
        dni_padre,
        correo_electronico,
        telefono,
        municipio,
        provincia,
        direccion,
        numero,
        puerta,
        escalera,
        codigo_postal,
        instrumento,
        familia_instrumento,
        sucursal,
        curso,
        horario,
        tipo_inscripcion,
        instrumento2,
        familia_instrumento2,
        instrumento3,
        familia_instrumento3
      );

      res
        .status(200)
        .send({ error: false, message: "Preinscripcion realizada" });

      await enviar_email(
        nombre,
        primer_apellido,
        segundo_apellido,
        fecha_nacimiento
      );
      await enviar_email_respuesta(correo_electronico);
    } else {
      res.status(400).send({ error: true, message: "Error Captcha" });
    }
  });
}

function enviar_email(
  nombre,
  primer_apellido,
  segundo_apellido,
  fecha_nacimiento
) {
  return new Promise((resolve, reject) => {
    let createTransport = s_transporter.obtener_transporter();

    envio_email.html =
      "<div> <p>Nueva preinscripción realizada</p> <p>Se ha recibido una soliciud para el alumno " +
      nombre +
      " " +
      primer_apellido +
      " " +
      segundo_apellido +
      "</p>" +
      "<p> Fecha de nacimiento: " +
      fecha_nacimiento +
      " </div> ";

    createTransport.sendMail(envio_email, function (error, info) {
      if (error) {
        console.log(error);
        console.log("Error al enviar email");
        reject();
      } else {
        console.log("Correo enviado correctamente");
        resolve();
      }
      createTransport.close();
    });
  });
}

function enviar_email_respuesta(correo) {
  return new Promise((resolve, reject) => {
    let createTransport = s_transporter.obtener_transporter();

    respuesta_email.to = correo;

    createTransport.sendMail(respuesta_email, function (error, info) {
      if (error) {
        console.log(error);
        console.log("Error al enviar email");
        reject();
      } else {
        console.log("Correo enviado correctamente");
        resolve();
      }
      createTransport.close();
    });
  });
}

function obtener_preinscripciones(req, res) {
  comun.comprobaciones_login(req, res, async () => {
    let resultados = await preinscripcion.obtener_preinscripciones();

    res.status(200).send({ error: false, preinscripciones: resultados });
  });
}

function obtener_preinscripciones_api(req, res) {
  comun.comprobaciones_api(req, res, async () => {
    let resultados = await preinscripcion.obtener_preinscripciones();

    res.status(200).send({ error: false, preinscripciones: resultados });
  });
}

function obtener_preinscripciones_detalle(req, res) {
  comun.comprobaciones_api(req, res, async () => {
    let nid_preinscripcion = req.params.nid_preinscripcion;

    let resultado = await preinscripcion.obtener_preincripciones_detalle(
      nid_preinscripcion
    );

    res.status(200).send({ error: false, preinscripciones: resultado });
  });
}

module.exports.obtener_preinscripciones = obtener_preinscripciones;
module.exports.registrar_preinscripcion = registrar_preinscripcion;
module.exports.obtener_preinscripciones_detalle =
  obtener_preinscripciones_detalle;
module.exports.obtener_preinscripciones_api = obtener_preinscripciones_api;
