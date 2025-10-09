
import "./FormularioPartitura.css";
import { EntradaTexto, Boton } from "../../ComponentesUI/ComponentesUI"
import { useState } from "react"
import { usePartitura } from "../../../hooks/usePartituras";


export default function FormularioPartitura({ nidPartitura }) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [url, setUrl] = useState('');
  const [nidCategoria, setNidCategoria] = useState(null);

  const {partitura, loading, registrarPartitura} = usePartitura(nidPartitura);

  if(loading) return (<div>Cargando...</div>);


  return (
    <div className="formulario-partitura-container">
      <h2>Partitura</h2>
      <form>
        <label>Titulo:</label>
          <EntradaTexto
            valorDefecto={partitura ? partitura.titulo : ''}
            setTexto={texto => {
              if (partitura) {
                setTitulo(texto);
              }
            }}
            width="300px"
          />
        
        <label>
          Autor:´ </label>
          <EntradaTexto
            valorDefecto={partitura ? partitura.autor : ''}
            setTexto={texto => {
              if (partitura) {
                setAutor(texto);
              }
            }}
            width="300px"
          />
        
        <label>
          URL:
           </label>
          <EntradaTexto
            valorDefecto={partitura ? partitura.url : ''}
            setTexto={texto => {
                if (partitura) {
                  setUrl(texto);
                }
              }}
              width="300px"
            />

    <Boton texto={"Guardar"} onClick={() =>
       {registrarPartitura({titulo: titulo, autor: autor,
                           url: url, nidCategoria: nidCategoria})}}>
    </Boton>
      </form>
    </div>
  );
}