import { useAsignaturas } from "../../../hooks/useAsignaturas";
import { useCursos } from "../../../hooks/useCursos";
import { Selector } from "../../ComponentesUI/ComponentesUI";
import { useState } from "react";
import "./AsistenciaAsignatura.css";
import { useAsistencias } from "../../../hooks/useAsistencias";

export default function AsistenciaAsignatura() {
  const { asignaturas, cargando, error, lanzarRefresco } = useAsignaturas();
  const { cursos, loading: loadingCursos, error: errorCursos } = useCursos();
  const listaAsignaturas = Array.isArray(asignaturas) ? asignaturas : [];
  const listaCursos = Array.isArray(cursos) ? cursos : [];

  const {
    asistencias,
    cargando: cargandoAsistencias,
    error: errorAsistencias,
  } = useAsistencias(asignaturaSeleccionada, cursoSeleccionado);

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

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);

  return (
    <>
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
      </div>
    </>
  );
}
