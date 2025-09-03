
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

  const { actualizarUsuario, usuario: usuarioSesion, actualizarRoles } = useContext(UsuarioContext);


  function actualizarLogin(usuario_, roles_)
  {
    actualizarUsuario(usuario_);
    actualizarRoles(roles_);
  }

  useEffect(() => {
    if (usuarioSesion) {
      navigate("/gestion/"); // Redirige a la raíz si ya hay usuario en sesión
    }
  }, [usuarioSesion, navigate]);

    function handleSubmit(e) {
    e.preventDefault(); // Evita el recargo de la página
    // Aquí va la acción del botón, por ejemplo:
    realizarLogin(usuario, password, actualizarLogin);
  }

  return (
  
    <div className="contenedor">


      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='contenedor'>
        <div className="campo">
      <span>Correo electrónico:</span>
      <EntradaTexto setTexto={(texto) => {setUsuario(texto)}} width='300px'/>
</div>
      <div className="campo">
      <span>Contraseña:</span>
      <EntradaTexto secure={true} setTexto={(texto) => {setPassword(texto)}} />
</div>
<div style={{ justifyContent: "center", display: "flex", paddingTop: "10px" }}>
      <Boton texto="Iniciar sesión" type="submit" />
      </div>
      </div>
</form>
    </div>
  );
}