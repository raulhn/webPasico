
import { EntradaTexto, Boton} from '../ComponentesUI/ComponentesUI'
import "./Login.css"
import {useState, useContext, useEffect} from "react";
import { useUsuario } from '../../hooks/useUsuario';
import { UsuarioContext } from '../../contexto/UsuarioContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { realizarLogin } = useUsuario();

  const navigate = useNavigate();

  const { actualizarUsuario, usuario: usuarioSesion } = useContext(UsuarioContext);



  useEffect(() => {
    if (usuarioSesion) {
      navigate("/gestion/"); // Redirige a la raíz si ya hay usuario en sesión
    }
  }, [usuarioSesion, navigate]);

    function handleSubmit(e) {
    e.preventDefault(); // Evita el recargo de la página
    // Aquí va la acción del botón, por ejemplo:
    realizarLogin(usuario, password, actualizarUsuario);
  }

  return (
  
    <div className="contenedor">

{usuarioSesion ? usuarioSesion.nid_usuario : "No hay usuario"}
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="campo">
      <span>Usuario:</span>
      <EntradaTexto setTexto={(texto) => {console.log(texto); setUsuario(texto)}} />
</div>
      <div className="campo">
      <span>Contraseña:</span>
      <EntradaTexto secure={true} setTexto={(texto) => {setPassword(texto)}} />
</div>
      <Boton texto="Iniciar sesión" type="submit" />
</form>
    </div>
  );
}