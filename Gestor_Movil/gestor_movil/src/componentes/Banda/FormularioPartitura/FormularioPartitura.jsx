
import "./FormularioPartitura.css";
import { EntradaTexto, Boton, ModalAviso, ModalExito, Selector } from "../../ComponentesUI/ComponentesUI"
import { useEffect, useState } from "react"
import { usePartitura } from "../../../hooks/usePartituras";
import { useCategorias } from "../../../hooks/useCategorias.js";
import { useNavigate } from "react-router";

export default function FormularioPartitura({ nidPartitura }) {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [url, setUrl] = useState('');
  const [nidCategoria, setNidCategoria] = useState(null);

  const [error, setError] = useState(false);
  const [exito, setExito] = useState(false);

  const {partitura, loading, registrarPartitura} = usePartitura(nidPartitura);
  const { categorias, loading: loadingCategorias, error: errorCategorias } = useCategorias();

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Partitura cargada en el formulario: ", partitura);
    if (partitura) {
      setTitulo(partitura.titulo || '');
      setAutor(partitura.autor || '');
      setUrl(partitura.url_partitura || '');
      setNidCategoria(partitura.nid_categoria || '');
    } else {
      setTitulo('');
      setAutor('');
      setUrl('');
      setNidCategoria('');
    }
  }, [loading, partitura]);

  const opcionesCategorias = categorias.map(cat => ({ valor: cat.nid_categoria, etiqueta: cat.nombre_categoria }))
      .concat({ valor: "", etiqueta: "Sin categoría" });

  if(loading) return (<div>Cargando...</div>);


  return (
    <div className="formulario-partitura-container">
      <h2>Partitura</h2>

        <label>Titulo:</label>
          <EntradaTexto
            valorDefecto={partitura ? partitura.titulo : ''}
            setTexto={texto => {
                setTitulo(texto);
            }}
            width="300px"
          />
        
        <label>
          Autor: </label>
          <EntradaTexto
            valorDefecto={partitura ? partitura.autor : ''}
            setTexto={texto => {
                setAutor(texto);
            }}
            width="300px"
          />
        
        <label>
          URL:
           </label>
          <EntradaTexto
            valorDefecto={partitura ? partitura.url_partitura : ''}
            setTexto={texto => {
                setUrl(texto);
            }}
            width="300px"
          />

<label>Categoría:</label>
      {loadingCategorias ? (
        <div>Cargando categorías...</div>
      ) : errorCategorias ? (
        <div>Error al cargar categorías: {errorCategorias}</div>
      ) : (
        <Selector
          valor={nidCategoria}
          opciones={opcionesCategorias}
          setValor={setNidCategoria}
        />
      )}

      <Boton texto={"Guardar"} onClick={() =>
        { console.log("Guardando partitura con datos: ", {nid_partitura: nidPartitura, titulo: titulo, autor: autor,
            url: url, nidCategoria: nidCategoria});
          const errorRespuesta = registrarPartitura({nid_partitura: nidPartitura, titulo: titulo, autor: autor,
            url: url, nid_categoria: nidCategoria});
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
      setVisible={() => {setExito(false); if (!nidPartitura) 
              {
                console.log("Navegando a la partitura recien creada con id: ", partitura.nid_partitura);
                navigate('/gestion/partitura/' + partitura.nid_partitura)}}}
      mensaje={"La partitura se ha guardado correctamente"}
      textBoton={"Aceptar"}
      titulo={"Éxito"}
    />
    </div>
  );
}