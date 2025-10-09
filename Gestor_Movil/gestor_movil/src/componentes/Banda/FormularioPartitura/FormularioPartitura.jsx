
import "./FormularioPartitura.css";
import { EntradaTexto, Boton, ModalAviso, ModalExito } from "../../ComponentesUI/ComponentesUI"
import { useEffect, useState } from "react"
import { usePartitura } from "../../../hooks/usePartituras";


export default function FormularioPartitura({ nidPartitura }) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [url, setUrl] = useState('');
  const [nidCategoria, setNidCategoria] = useState(null);

  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);

  const {partitura, loading, registrarPartitura} = usePartitura(nidPartitura);

  useEffect(() => {
    console.log("Partitura cargada en el formulario: ", partitura);
    if (partitura) {
      setTitulo(partitura.titulo || '');
      setAutor(partitura.autor || '');
      setUrl(partitura.url_partitura || '');
      setNidCategoria(partitura.nid_categoria || null);
    } else {
      setTitulo('');
      setAutor('');
      setUrl('');
      setNidCategoria(null);
    }
  }, [loading]);


  if(loading) return (<div>Cargando...</div>);


  return (
    <div className="formulario-partitura-container">
      <h2>Partitura</h2>

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
          Autor: </label>
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
            valorDefecto={partitura ? partitura.url_partitura : ''}
            setTexto={texto => {
                if (partitura) {
                  setUrl(texto);
                }
              }}
              width="300px"
            />

    <Boton texto={"Guardar"} onClick={() =>
       { const errorRespuesta = registrarPartitura({nid_partitura: nidPartitura, titulo: titulo, autor: autor,
                           url: url, nidCategoria: nidCategoria});
          setError(!errorRespuesta);
          setExito(errorRespuesta);
       }}>
    </Boton>

    <ModalAviso
      visible={error}
      setVisible={() => {setError(false)}}
      mensaje={ "Se ha producido un error al guardar la partitura" }
      textBoton={"Aceptar"}
      titulo={"Error"}
    />

    <ModalExito
      visible={exito}
      setVisible={() => {setExito(false)}}
      mensaje={"La partitura se ha guardado correctamente"}
      textBoton={"Aceptar"}
      titulo={"Éxito"}
    />
    </div>
  );
}