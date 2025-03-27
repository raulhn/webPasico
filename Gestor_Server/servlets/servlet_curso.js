const curso = require("../logica/curso.js");
const comun = require("./servlet_comun.js");

function registrar_curso(req, res) {
  comun.comprobaciones(req, res, async () => {
    let descripcion = req.body.descripcion;
    await curso.registrar_curso(descripcion);

    res.status(200).send({ error: false, message: "Curso registrado" });
  });
}

function obtener_cursos(req, res) {
  comun.comprobaciones_general(req, res, async () => {
    let resultado = await curso.obtener_cursos();
    res.status(200).send({ error: false, cursos: resultado });
  });
}

function eliminar_curso(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_curso = req.body.nid_curso;
    await curso.eliminar_curso(nid_curso);

    res.status(200).send({ error: false, message: "Curso eliminado" });
  });
}

function obtener_nid_ultimo_curso(req, res) {
  comun.comprobaciones_general(req, res, async () => {
    let nid_ultimo_curso = await curso.obtener_ultimo_curso();
    res.status(200).send({ error: false, nid_ultimo_curso: nid_ultimo_curso });
  });
}

module.exports.registrar_curso = registrar_curso;
module.exports.obtener_cursos = obtener_cursos;
module.exports.eliminar_curso = eliminar_curso;

module.exports.obtener_nid_ultimo_curso = obtener_nid_ultimo_curso;
