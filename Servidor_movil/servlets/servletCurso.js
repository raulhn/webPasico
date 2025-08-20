const gestorCursos = require("../logica/curso.js");
const servletComun = require("./servlet_comun.js");

function registrarCurso(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nid_curso = req.body.nid_curso;
      let descripcion = req.body.descripcion;
      let ano = req.body.ano;
      let fecha_actualizacion = req.body.fecha_actualizacion;

      console.log(
        "Registrar Curso: ",
        nid_curso,
        descripcion,
        ano,
        fecha_actualizacion
      );

      gestorCursos
        .registrarCurso(nid_curso, descripcion, ano, fecha_actualizacion)
        .then(() => {
          res.status(200).send({
            error: false,
            mensaje: "Curso registrado correctamente",
          });
        })
        .catch((error) => {
          console.error("Error al registrar el curso:" + error.message);
          res.status(400).send({
            error: true,
            mensaje: "Error al registrar el curso",
          });
        });
    } catch (error) {
      console.error("Error al registrar el curso:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al registrar el curso",
      });
    }
  });
}


async function obtenerCursos(req, res) {
try{
  const cursos = await gestorCursos.obtenerCursos();
  res.status(200).send({
    error: false,
    cursos: cursos
  });
}
catch (error) {
  console.error("Error al obtener los cursos:" + error.message);
  res.status(400).send({
    error: true,
    mensaje: "Error al obtener los cursos",
  });
}
}


module.exports.registrarCurso = registrarCurso;
module.exports.obtenerCursos = obtenerCursos;
