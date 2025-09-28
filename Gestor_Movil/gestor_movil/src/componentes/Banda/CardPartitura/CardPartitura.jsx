import "./CardPartitura.css";

export default function CardPartitura({ partitura }) {
  return (
    <div className="card">
      <h3>{partitura.titulo}</h3>
      <p>Compositor: {partitura.compositor}</p>
    </div>
  );
}