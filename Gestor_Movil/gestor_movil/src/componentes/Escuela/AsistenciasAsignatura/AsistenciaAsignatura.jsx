import { useAsignaturas } from "../../../hooks/useAsignaturas";
import { useCursos } from "../../../hooks/useCursos";
import { Selector } from "../../ComponentesUI/ComponentesUI";
import { useState } from "react";

export default function AsistenciaAsignatura() {
  const { asignaturas, cargando, error, lanzarRefresco } = useAsignaturas();
  const { cursos, loading: loadingCursos, error: errorCursos } = useCursos();

  const elementos_asignaturas = asignaturas
    .map((asignatura) => ({
      valor: asignatura.nid_asignatura,
      etiqueta: asignatura.nombre,
    }))
    .push({ valor: "", etiqueta: "Selecciona una asignatura" });

  const elementos_cursos = cursos
    .map((curso) => ({
      valor: curso.nid_curso,
      etiqueta: curso.nombre,
    }))
    .push({ valor: "", etiqueta: "Selecciona un curso" });

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);

  return (
    <>
      <Selector opciones={elementos_cursos} setValor={setCursoSeleccionado} />
      <Selector
        opciones={elementos_asignaturas}
        setValor={setAsignaturaSeleccionada}
      />
    </>
  );
}
