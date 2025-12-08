import * as GestorProfesor from "../logica/profesor.js";
import * as comun from "./comun.js";
import * as gestorMatricula from "../logica/matricula.js";
import * as GestorCurso from "../logica/curso.js";

export function darDeBajaProfesor(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let nid_profesor = req.body.nid_profesor;
      let nid_asignatura = req.body.nid_asignatura;

      let ultimoCurso = await GestorCurso.obtener_ultimo_curso();
      let alumnosProfesor = await gestorMatricula.obtener_alumnos_profesor(
        nid_profesor,
        ultimoCurso,
        nid_asignatura,
      );

      if (alumnosProfesor && alumnosProfesor.length > 0) {
        res.status(400).send({
          error: true,
          message:
            "No se puede dar de baja al profesor porque tiene alumnos asignados",
        });
        return;
      }
      await GestorProfesor.darDeBajaProfesor(nid_profesor, nid_asignatura);
      res
        .status(200)
        .send({ error: false, message: "Se ha dado de baja al profesor" });
    } catch (error) {
      console.log("servlet_profesor.js - darDeBajaProfesor - Error: " + error);
      res.status(500).send({ error: true, message: "Error del servidor" });
    }
  });
}
