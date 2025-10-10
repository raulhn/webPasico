
import './Partituras.css';
import { usePartituras } from '../../../hooks/usePartituras';
import CardPartitura from '../CardPartitura/CardPartitura.jsx';
import { useNavigate } from 'react-router-dom';
import { Boton } from '../../ComponentesUI/ComponentesUI.jsx';
import Cabecera from '../../Cabecera/Cabecera.jsx';

export default function Partituras() {
  const { partituras, loading, error } = usePartituras();
  const navigate = useNavigate();


  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <Cabecera />
    <div className="partituras-container">
      <h1>Partituras</h1>
      <p>Aquí se mostrarán las partituras disponibles.</p>
      <Boton texto="Agregar Partitura" onClick={() => {navigate('/gestion/nueva_partitura')}} />
      <ul className="partituras-list">
        {partituras.map(partitura => (
          <li key={partitura.nid_partitura}>
            <CardPartitura partitura={partitura} />
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

