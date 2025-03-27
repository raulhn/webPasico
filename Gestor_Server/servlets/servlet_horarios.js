const horarios = require("../logica/horarios.js");
const comun = require("./servlet_comun.js");

function registrar_horario(req, res) {
  comun.comprobaciones(req, res, async () => {
    let dia = req.body.dia;

    let hora_inicio = req.body.hora_inicio;
    let minutos_inicio = req.body.minutos_inicio;

    let hora_fin = req.body.hora_fin;
    let minutos_fin = req.body.minutos_fin;

    let nid_asignatura = req.body.nid_asignatura;
    let nid_profesor = req.body.nid_profesor;

    let duracion_clase = req.body.duracion_clase;

    await horarios.crear_horario(
      dia,
      hora_inicio,
      minutos_inicio,
      hora_fin,
      minutos_fin,
      nid_asignatura,
      nid_profesor,
      duracion_clase
    );

    res
      .status(200)
      .send({ error: false, meessage: "Se ha registrado el horario" });
  });
}

function registrar_horario_clase(req, res) {
  comun.comprobaciones(req, res, async () => {
    let hora_inicio = req.body.hora_inicion;
    let minutos_inicio = req.body.minutos_inicio;

    let duracion_clase = req.body.duracion_clase;
    let nid_horario = req.body.nid_horario;

    await horarios.registrar_horario_clase(
      hora_inicio,
      minutos_inicio,
      duracion_clase,
      0,
      nid_horario
    );

    res
      .status(200)
      .send({ error: false, message: "Se ha registrado el horario" });
  });
}

function eliminar_horario_clase(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_horario_clase = req.body.nid_horario_clase;

    await horarios.eliminar_horario_clase(nid_horario_clase);

    res
      .status(200)
      .send({ error: false, message: "Se ha eliminado el horario" });
  });
}

function eliminar_horario(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_horario = req.body.nid_horario;

    await horarios.eliminar_horario(nid_horario);

    res
      .status(200)
      .send({ error: false, message: "Se ha eliminado el horario" });
  });
}

function asignar_horario_clase(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_matricula_asignatura = req.body.nid_matricula_asignatura;
    let nid_horario_clase = req.body.nid_horario_clase;

    await horarios.asignar_horario_clase(
      nid_horario_clase,
      nid_matricula_asignatura
    );

    res
      .status(200)
      .send({ error: false, message: "Se ha asigando el horario" });
  });
}

function liberar_horario_clase(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_matricula_asignatura = req.body.nid_matricula_asignatura;
    let nid_horario_clase = req.body.nid_horario_clase;

    await horarios.liberar_horario_clase(
      nid_horario_clase,
      nid_matricula_asignatura
    );

    res
      .status(200)
      .send({ error: false, message: "Se ha liberado el horario" });
  });
}

function obtener_horarios(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_profesor = req.params.nid_profesor;
    let nid_asignatura = req.params.nid_asignatura;
    let nid_curso = req.params.nid_curso;

    let horarios_recuperados = await horarios.obtener_horarios(
      nid_profesor,
      nid_asignatura,
      nid_curso
    );
    let horarios_clase_recuperados = await horarios.obtener_horarios_clase(
      nid_profesor,
      nid_asignatura,
      nid_curso
    );

    res
      .status(200)
      .send({
        error: false,
        horarios: horarios_recuperados,
        horarios_clase: horarios_clase_recuperados,
      });
  });
}

function obtener_horario_clase_alumno(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_matricula = req.params.nid_matricula;

    let horarios_clase_recuperados =
      await horarios.obtener_horario_clase_alumno(nid_matricula);
    res
      .status(200)
      .send({ error: false, horarios_clase: horarios_clase_recuperados });
  });
}

function obtener_horario(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_horario = req.params.nid_horario;

    let horarios_recuperados = await horarios.obtener_horario(nid_horario);
    let horarios_clase_recuperados = await horarios.obtener_horario_clase(
      nid_horario
    );

    res
      .status(200)
      .send({
        error: false,
        horarios: horarios_recuperados,
        horarios_clase: horarios_clase_recuperados,
      });
  });
}

function obtener_horario_profesor(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_profesor = req.params.nid_profesor;

    let horarios_clase_recuperados = await horarios.obtener_horarios_profesor(
      nid_profesor
    );

    res
      .status(200)
      .send({ error: false, horarios_clase: horarios_clase_recuperados });
  });
}

function obtener_alumnos_horario_clase(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_horario_clase = req.params.nid_horario_clase;

    let alumnos_recuperados = await horarios.obtener_alumnos_horario_clase(
      nid_horario_clase
    );

    res.status(200).send({ error: false, alumnos: alumnos_recuperados });
  });
}

function obtener_alumnos_sin_asignar(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_horario_clase = req.params.nid_horario_clase;

    let alumnos_recuperados = await horarios.obtener_alumnos_sin_asignar(
      nid_horario_clase
    );

    res.status(200).send({ error: false, alumnos: alumnos_recuperados });
  });
}

module.exports.registrar_horario = registrar_horario;
module.exports.registrar_horario_clase = registrar_horario_clase;
module.exports.asignar_horario_clase = asignar_horario_clase;
module.exports.liberar_horario_clase = liberar_horario_clase;
module.exports.eliminar_horario_clase = eliminar_horario_clase;
module.exports.eliminar_horario = eliminar_horario;

module.exports.obtener_horarios = obtener_horarios;
module.exports.obtener_horario = obtener_horario;
module.exports.obtener_horario_profesor = obtener_horario_profesor;
module.exports.obtener_horario_clase_alumno = obtener_horario_clase_alumno;

module.exports.obtener_alumnos_horario_clase = obtener_alumnos_horario_clase;
module.exports.obtener_alumnos_sin_asignar = obtener_alumnos_sin_asignar;
