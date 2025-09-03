import "./CardEvaluacion.css";

export default function CardEvaluacion({ evaluacion }) {
  return (
    <div className="card-evaluacion">
      <h3>{evaluacion.nombre_asignatura}</h3>
      <p><strong>Trimestre:</strong> {evaluacion.nombre_trimestre}</p>
      <p className="comentario"><strong>Comentario:</strong> {evaluacion.comentario}</p>
      <p className="progreso" style={{ color: evaluacion.nid_tipo_progreso == "2" ? "#38a169" : "#e53e3e" }}><strong>Progreso:</strong> {evaluacion.tipo_progreso}</p>
      {evaluacion.nota > 0 && <p className="nota"><strong>Nota:</strong> {evaluacion.nota}</p>}
      <p><strong>Profesor:</strong> {evaluacion.nombre_profesor}</p>
    </div>
  );
}
