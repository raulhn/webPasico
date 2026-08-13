import {
  useAsignaturas,
  useAsignaturasProfesor,
} from "../../../hooks/useAsignaturas";
import { useCursos } from "../../../hooks/useCursos";
import { DropDown, Selector } from "../../ComponentesUI/ComponentesUI";
import { useContext, useMemo, useState } from "react";
import { useAsistencias } from "../../../hooks/useAsistencias";
import Cabecera from "../../Cabecera/Cabecera";
import { UsuarioContext } from "../../../contexto/UsuarioContext";
import "./AsistenciaAsignatura.css";

function formatearFecha(fecha) {
  const fechaTexto = String(fecha || "").slice(0, 10);
  const [ano, mes, dia] = fechaTexto.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "-";
}

export default function AsistenciaAsignatura() {
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");
  const { comprobarRoles } = useContext(UsuarioContext);
  const {
    asignaturas: todasLasAsignaturas,
    cargando: cargandoTodasLasAsignaturas,
    error: errorTodasLasAsignaturas,
  } = useAsignaturas();
  const {
    asignaturas: asignaturasProfesor,
    cargando: cargandoAsignaturasProfesor,
    error: errorAsignaturasProfesor,
  } = useAsignaturasProfesor();
  const { cursos, loading: loadingCursos, error: errorCursos } = useCursos();
  const listaCursos = Array.isArray(cursos) ? cursos : [];
  const puedeConsultarTodasLasAsignaturas = comprobarRoles([
    "ADMINISTRADOR",
    "DIRECTIVO",
  ]);
  const esProfesor = comprobarRoles(["PROFESOR"]);
  const listaAsignaturas = puedeConsultarTodasLasAsignaturas
    ? Array.isArray(todasLasAsignaturas)
      ? todasLasAsignaturas
      : []
    : esProfesor && Array.isArray(asignaturasProfesor)
      ? asignaturasProfesor
      : [];
  const cargandoAsignaturas = puedeConsultarTodasLasAsignaturas
    ? cargandoTodasLasAsignaturas
    : cargandoAsignaturasProfesor;
  const errorAsignaturas = puedeConsultarTodasLasAsignaturas
    ? errorTodasLasAsignaturas
    : errorAsignaturasProfesor;

  const {
    asistencias,
    cargando: cargandoAsistencias,
    error: errorAsistencias,
  } = useAsistencias(asignaturaSeleccionada, cursoSeleccionado);

  const faltasPorAlumno = useMemo(() => {
    const alumnos = new Map();

    asistencias
      .filter((asistencia) => asistencia.falta === "S")
      .forEach((asistencia) => {
        const alumno = alumnos.get(asistencia.nid_persona) || {
          nidPersona: asistencia.nid_persona,
          nombre: [
            asistencia.nombre,
            asistencia.primer_apellido,
            asistencia.segundo_apellido,
          ]
            .filter(Boolean)
            .join(" "),
          faltas: [],
        };
        alumno.faltas.push(asistencia);
        alumnos.set(asistencia.nid_persona, alumno);
      });

    return Array.from(alumnos.values());
  }, [asistencias]);

  const elementos_asignaturas = [
    { valor: "", etiqueta: "Selecciona una asignatura" },
    ...listaAsignaturas.map((asignatura) => ({
      valor: asignatura.nid_asignatura,
      etiqueta: asignatura.descripcion,
    })),
  ];

  const elementos_cursos = [
    { valor: "", etiqueta: "Selecciona un curso" },
    ...listaCursos.map((curso) => ({
      valor: curso.nid_curso,
      etiqueta: curso.descripcion,
    })),
  ];

  return (
    <>
      <Cabecera />
      <div
        className="contenedor asistencia-asignatura-contenedor"
        style={{ paddingTop: "60px" }}
      >
        <main className="asistencia-asignatura">
          <h2>Asistencia por asignatura</h2>
          <div className="asistencia-asignatura-filtros">
            <label>
              Curso
              <Selector
                opciones={elementos_cursos}
                setValor={setCursoSeleccionado}
                valor={cursoSeleccionado}
                width="280px"
              />
            </label>
            <label>
              Asignatura
              <Selector
                opciones={elementos_asignaturas}
                setValor={setAsignaturaSeleccionada}
                valor={asignaturaSeleccionada}
                width="280px"
              />
            </label>
          </div>

          {(cargandoAsignaturas || loadingCursos) && (
            <p>Cargando opciones...</p>
          )}
          {(errorAsignaturas || errorCursos) && (
            <p>
              {errorAsignaturas?.message ||
                errorCursos?.message ||
                "Error al cargar las opciones."}
            </p>
          )}

          {cursoSeleccionado && asignaturaSeleccionada && cargandoAsistencias && (
            <p>Cargando asistencias...</p>
          )}
          {cursoSeleccionado && asignaturaSeleccionada && errorAsistencias && (
            <p>
              {errorAsistencias.message ||
                "No se han podido obtener las asistencias."}
            </p>
          )}
          {cursoSeleccionado &&
            asignaturaSeleccionada &&
            !cargandoAsistencias &&
            !errorAsistencias &&
            (faltasPorAlumno.length === 0 ? (
              <p>No hay faltas registradas para esta asignatura y curso.</p>
            ) : (
              <div className="asistencia-asignatura-listado">
                {faltasPorAlumno.map((alumno) => (
                  <DropDown
                    key={alumno.nidPersona}
                    cabecera={
                      <div>
                        <strong>{alumno.nombre}</strong>
                        <div>
                          {alumno.faltas.length}{" "}
                          {alumno.faltas.length === 1 ? "falta" : "faltas"}
                        </div>
                      </div>
                    }
                    cuerpo={
                      <ul className="asistencia-asignatura-detalles">
                        {alumno.faltas.map((falta) => (
                          <li key={falta.nid_asistencia_grupo}>
                            <strong>{formatearFecha(falta.fecha)}</strong>
                            {" · "}
                            {falta.grupo}
                            {" · "}
                            {falta.justificada === "S"
                              ? "Justificada"
                              : "No justificada"}
                            {falta.causa ? ` · ${falta.causa}` : ""}
                          </li>
                        ))}
                      </ul>
                    }
                  />
                ))}
              </div>
            ))}
        </main>
      </div>
    </>
  );
}
