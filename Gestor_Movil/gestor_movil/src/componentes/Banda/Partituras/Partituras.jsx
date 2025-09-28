import { usePartituras } from '../../../hooks/usePartituras';
import CardPartitura from '../CardPartitura/CardPartitura.jsx';

export default function Partituras() {
  const { partituras, loading, error } = usePartituras();

  console.log(partituras);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Partituras</h1>
      <p>Aquí se mostrarán las partituras disponibles.</p>
      <ul>
        {partituras.map(partitura => (
          <li key={partitura.nid_partitura}>
            <CardPartitura partitura={partitura} />
          </li>
        ))}
      </ul>
    </div>
  );
}

