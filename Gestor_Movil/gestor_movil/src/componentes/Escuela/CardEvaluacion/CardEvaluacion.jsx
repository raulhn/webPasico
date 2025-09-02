import "./CardEvaluacion.css";

export default function CardEvaluacion({ evaluacion }) {
  return (
    <div className="card-evaluacion">
      <h3>{evaluacion.nombre}</h3>
      <p>Comentario: {evaluacion.comentario}</p>
      <p>Nota: {evaluacion.nota}</p>
    </div>
  );
}
