import { useAsignaturas } from "../../../hooks/useAsignaturas";
import { useCursos } from "../../../hooks/useCursos";
import { DataTable, Selector } from "../../ComponentesUI/ComponentesUI";
import { useState } from "react";
import { useAsistencias } from "../../../hooks/useAsistencias";

export default function AsistenciaAsignatura() {
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");
  const { asignaturas, cargando, error } = useAsignaturas();
  const { cursos, loading: loadingCursos, error: errorCursos } = useCursos();
  const listaAsignaturas = Array.isArray(asignaturas) ? asignaturas : [];
  const listaCursos = Array.isArray(cursos) ? cursos : [];

  const {
    asistencias,
    cargando: cargandoAsistencias,
    error: errorAsistencias,
  } = useAsistencias(asignaturaSeleccionada, cursoSeleccionado);

  const filasAsistencias = asistencias.map((asistencia, indice) => [
    `${asistencia.fecha}-${asistencia.grupo}-${indice}`,
    [asistencia.nombre, asistencia.primer_apellido, asistencia.segundo_apellido]
      .filter(Boolean)
      .join(" "),
    asistencia.grupo,
    String(asistencia.fecha || "").slice(0, 10),
    asistencia.falta === "S" ? "Falta" : "Presente",
    asistencia.falta === "S" && asistencia.justificada === "S" ? "Sí" : "No",
    asistencia.causa || "-",
  ]);

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
      <div className="contenedor">
        <Selector
          opciones={elementos_cursos}
          setValor={setCursoSeleccionado}
          valor={cursoSeleccionado}
        />
        <Selector
          opciones={elementos_asignaturas}
          setValor={setAsignaturaSeleccionada}
          valor={asignaturaSeleccionada}
        />

        {(cargando || loadingCursos) && <p>Cargando opciones...</p>}
        {(error || errorCursos) && (
          <p>
            {error?.message ||
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
          !errorAsistencias && (
            <div className="tabla-container">
              <DataTable
                datos={filasAsistencias}
                cabeceras={[
                  "Alumno",
                  "Grupo",
                  "Fecha",
                  "Estado",
                  "Justificada",
                  "Causa",
                ]}
              />
            </div>
          )}
      </div>
    </>
  );
}
