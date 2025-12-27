import { useParams } from "react-router";
import { useEvaluacionesAsignaturaProfesor } from "../../../hooks/useEvaluaciones";
import Cabecera from "../../Cabecera/Cabecera";
import "./EvaluacionesProfesor.css";

const progresos = ["Sin evaluar", "Necesita Mejorar", "Progresa Adecuadamente"];
function CardVisualizarEvaluacion({ evaluacion }) {
  return (
    <div key={evaluacion.nid_evaluacion} className="card-evaluacion">
      <h3>Evaluación: {evaluacion.nota}</h3>
      <p>Comentario: {evaluacion.comentario}</p>
      <p>Progreso: {progresos[evaluacion.nid_tipo_progreso]}</p>
    </div>
  );
}
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
      <Cabecera />
      <h2>Evaluaciones del Profesor</h2>

      {/* Aquí se implementaría la lógica para mostrar las evaluaciones del profesor */}
      {evaluaciones.map((evaluacion) => (
        <CardVisualizarEvaluacion evaluacion={evaluacion} />
      ))}
      {error && <p>Error al cargar las evaluaciones: {error}</p>}
    </div>
  );
}
