import { useParams } from "react-router";
import { useEvaluacionesAsignaturaProfesor } from "../../../hooks/useEvaluaciones";
import Cabecera from "../../Cabecera/Cabecera";
import "./EvaluacionesProfesor.css";

const progresos = ["Sin evaluar", "Necesita Mejorar", "Progresa Adecuadamente"];
function CardVisualizarEvaluacion({ evaluacion }) {
  return (
    <div key={evaluacion.nid_evaluacion} className="card-evaluacion">
      <h3>Evaluación: {evaluacion.nota}</h3>
      <h4>Alumno: {evaluacion.alumno}</h4>
      <p>Comentario: {evaluacion.comentario}</p>
      <p className="progreso">
        Progreso:{" "}
        <span
          style={{
            color: evaluacion.nid_tipo_progreso == "2" ? "#38a169" : "#e53e3e",
          }}
        >
          {progresos[evaluacion.nid_tipo_progreso]}
        </span>
      </p>
      <p>Profesor: {evaluacion.profesor}</p>
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
      <div style={{ paddingTop: "60px" }}>
        <h2>Evaluaciones del Profesor</h2>

        {/* Aquí se implementaría la lógica para mostrar las evaluaciones del profesor */}
        {evaluaciones.map((evaluacion) => (
          <CardVisualizarEvaluacion evaluacion={evaluacion} />
        ))}
        {error && <p>Error al cargar las evaluaciones: {error}</p>}
        {evaluaciones.length === 0 && !error && (
          <p className="card-evaluacion">No hay evaluaciones disponibles.</p>
        )}
      </div>
    </div>
  );
}
