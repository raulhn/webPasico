
import './Partituras.css';
import { usePartituras } from '../../../hooks/usePartituras';
import CardPartitura from '../CardPartitura/CardPartitura.jsx';
import { useNavigate } from 'react-router-dom';
import { Boton, EntradaTexto, Paginacion } from '../../ComponentesUI/ComponentesUI.jsx';
import Cabecera from '../../Cabecera/Cabecera.jsx';
import { useState, useEffect } from 'react';


export default function Partituras() {
  const { partituras, loading, error } = usePartituras();
  const navigate = useNavigate();
  const [partiturasFiltradas, setPartiturasFiltradas] = useState([]);

  // Inicializar partituras filtradas cuando carguen las partituras
  useEffect(() => {
    if (partituras && partituras.length > 0) {
      setPartiturasFiltradas(partituras);
    }
  }, [partituras]);

  const arrayPartituras = partiturasFiltradas.map(partitura => (
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
      <div style={{ justifyContent: "space-between", display: "flex", alignItems: "center", gap: "10px", marginTop: "20px", marginBottom: "20px" }}>
   
      <Boton texto="Agregar Partitura" onClick={() => {navigate('/gestion/nueva_partitura')}} />

      <EntradaTexto
            valorDefecto=""
            setTexto={(texto) => {
              if (partituras && partituras.length > 0) {
                let copiaPartituras = [...partituras].filter(p => 
                  p.titulo.toLowerCase().includes(texto.toLowerCase()) ||
                  (p.autor && p.autor.toLowerCase().includes(texto.toLowerCase()))
                ); 
                setPartiturasFiltradas(copiaPartituras);
              }
            }}
          />
      </div>
      <Paginacion className="partituras-list"
        array={arrayPartituras}
        page_size={6}
        page_number={1}
        />
      
      
    </div>
    </>
  );
}

