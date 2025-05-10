const matricula = require("../logica/matricula.js");
const comun = require("../servlets/servlet_comun.js");
const profesor = require("../logica/profesor.js");
const gestion_usuarios = require("../logica/usuario.js");
const gestorMatriculaAsignatura = require("../logica/matricula_asignatura.js");
const serviceMatriculaAsignatura = require("../services/serviceMatriculaAsignatura.js");

function obtener_matriculas_asignaturas_alumno(req, res) {
  comun.comprobaciones_profesor(req, res, async () => {
    let usuario = req.session.nombre;
    let nid_profesor = await gestion_usuarios.obtener_nid_persona(usuario);

    let nid_matricula = req.params.nid_matricula;
    let v_matricula = await matricula.obtener_matricula(nid_matricula);

    let nid_alumno = v_matricula.nid_persona;
    let nid_curso = v_matricula.nid_curso;

    let bEsProfesor = await profesor.esAlumnoProfesor(
      nid_alumno,
      nid_profesor,
      nid_curso
    );

    if (bEsProfesor) {
      let resultados = await matricula.obtener_asignaturas_matricula(
        nid_matricula
      );
      res.status(200).send({
        error: false,
        mensaje: "Matriculas de asignaturas obtenidas correctamente",
        matriculas_asignaturas: resultados,
        nombre_alumno: v_matricula.nombre_alumno,
      });
    } else {
      res.status(403).send({
        error: true,
        mensaje: "El profesor no tiene acceso a las matriculas de este alumno",
      });
    }
  });
}

function actualizar_fecha_alta_matricula_asignatura(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let nid_matricula_asignatura = req.body.nid_matricula_asignatura;
      let fecha_alta = req.body.fecha_alta;

      await gestorMatriculaAsignatura.actualizar_fecha_alta_matricula_asignatura(
        nid_matricula_asignatura,
        fecha_alta
      );

      await serviceMatriculaAsignatura.registrar_matricula_asignatura(
        nid_matricula_asignatura
      );
      res.status(200).send({ error: false, message: "Fecha actualizada" });
    } catch (error) {
      console.error(
        "Error en la función actualizar_fecha_alta_matricula_asignatura:",
        error
      );
      res.status(500).send({
        error: true,
        message: "Error al actualizar la fecha de alta",
      });
    }
  });
}

function actualizar_fecha_baja_matricula_asignatura(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let nid_matricula_asignatura = req.body.nid_matricula_asignatura;
      let fecha_baja = req.body.fecha_baja;

      await gestorMatriculaAsignatura.actualizar_fecha_baja_matricula_asignatura(
        nid_matricula_asignatura,
        fecha_baja
      );

      await serviceMatriculaAsignatura.registrar_matricula_asignatura(
        nid_matricula_asignatura
      );
      res.status(200).send({ error: false, message: "Fecha actualizada" });
    } catch (error) {
      console.error(
        "Error en la función actualizar_fecha_baja_matricula_asignatura:",
        error
      );
      res.status(500).send({
        error: true,
        message: "Error al actualizar la fecha de baja",
      });
    }
  });
}

function dar_baja_asignatura(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let nid_matricula = req.body.nid_matricula;
      let nid_asignatura = req.body.nid_asignatura;
      let fecha_baja = req.body.fecha_baja;
      let nid = req.body.nid;

      await matricula.dar_baja_asignatura(
        nid,
        nid_matricula,
        nid_asignatura,
        fecha_baja
      );

      let nid_matricula_asignatura =
        await gestorMatriculaAsignatura.obtener_nid_matricula_asignatura(
          nid_matricula,
          nid_asignatura
        );
      await serviceMatriculaAsignatura.registrar_matricula_asignatura(
        nid_matricula_asignatura
      );

      res.status(200).send({ error: false, message: "Alumno dado de baja" });
    } catch (error) {
      console.error("Error al dar de baja la asignatura:", error);
      res.status(500).send({
        error: true,
        message: "Error al dar de baja la asignatura",
      });
    }
  });
}

module.exports.obtener_matriculas_asignaturas_alumno =
  obtener_matriculas_asignaturas_alumno;
module.exports.actualizar_fecha_alta_matricula_asignatura =
  actualizar_fecha_alta_matricula_asignatura;
module.exports.actualizar_fecha_baja_matricula_asignatura =
  actualizar_fecha_baja_matricula_asignatura;

module.exports.dar_baja_asignatura = dar_baja_asignatura;
