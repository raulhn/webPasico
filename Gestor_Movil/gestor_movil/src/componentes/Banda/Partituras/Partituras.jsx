
import './Partituras.css';
import { usePartituras } from '../../../hooks/usePartituras';
import CardPartitura from '../CardPartitura/CardPartitura.jsx';
import { useNavigate } from 'react-router-dom';
import { Boton, Paginacion } from '../../ComponentesUI/ComponentesUI.jsx';
import Cabecera from '../../Cabecera/Cabecera.jsx';


export default function Partituras() {
  const { partituras, loading, error } = usePartituras();
  const navigate = useNavigate();

  const arrayPartituras = partituras.map(partitura => (
    <CardPartitura partitura={partitura} key={partitura.nid_partitura} />
  ));

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

        <Paginacion className="partituras-list"
          array={arrayPartituras}
          page_size={6}
          page_number={1}
        />
      
      
    </div>
    </>
  );
}

