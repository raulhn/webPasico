const matricula = require("../logica/matricula.js");
const comun = require("../servlets/servlet_comun.js");
const profesor = require("../logica/profesor.js");
const gestion_usuarios = require("../logica/usuario.js");

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
      res
        .status(200)
        .send({
          error: false,
          mensaje: "Matriculas de asignaturas obtenidas correctamente",
          matriculas_asignaturas: resultados,
          nombre_alumno: v_matricula.nombre_alumno,
        });
    } else {
      res
        .status(403)
        .send({
          error: true,
          mensaje:
            "El profesor no tiene acceso a las matriculas de este alumno",
        });
    }
  });
}

module.exports.obtener_matriculas_asignaturas_alumno =
  obtener_matriculas_asignaturas_alumno;
