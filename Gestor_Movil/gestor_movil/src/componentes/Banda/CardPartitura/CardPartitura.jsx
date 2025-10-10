import "./CardPartitura.css";
import { useContext } from "react";
import { UsuarioContext } from "../../../contexto/UsuarioContext.js";
import { Boton } from "../../ComponentesUI/ComponentesUI.jsx";
import { useNavigate } from "react-router-dom";

export default function CardPartitura({ partitura }) {

  const { usuario, comprobarRoles, roles } = useContext(UsuarioContext);
  const navigate = useNavigate();

  function editarPartitura() {
    if (comprobarRoles(['ADMINISTRADOR'])) {
      // Lógica para editar la partitura
      return (<Boton texto="Editar"
        onClick={() => navigate(`/gestion/partitura/${partitura.nid_partitura}`)}>
        </Boton>);
    } else {
      return null;
    }
  }
  

  return (
    <div className="card">
      <h3>{partitura.titulo}</h3>
      {editarPartitura()}
      <p>Compositor: {partitura.autor}</p>
      {partitura.url_partitura && <a href={partitura.url_partitura} target="_blank" rel="noopener noreferrer">Ver Partitura</a>}
    </div>
  );
}