import { useParams } from "react-router";
import { useEvaluacionesAsignaturaProfesor } from "../../../hooks/useEvaluaciones";

export default function EvaluacionesProfesor() {
  const { nidCurso, nidAsignatura, nidTrimestre, nidProfesor } = useParams();

  const { evaluaciones, error } = useEvaluacionesAsignaturaProfesor(
    nidCurso,
    nidAsignatura,
    nidTrimestre,
    nidProfesor,
  );
  return (
    <div>
      <h2>Evaluaciones del Profesor</h2>
      <p>Curso ID: {nidCurso}</p>
      <p>Asignatura ID: {nidAsignatura}</p>
      <p>Trimestre ID: {nidTrimestre}</p>
      {/* Aquí se implementaría la lógica para mostrar las evaluaciones del profesor */}
      {evaluaciones.map((evaluacion) => (
        <div key={evaluacion.nid_evaluacion}>
          <h3>{evaluacion.nota}</h3>
          <p>{evaluacion.comentario}</p>
        </div>
      ))}
      {error && <p>Error al cargar las evaluaciones: {error}</p>}
    </div>
  );
}
