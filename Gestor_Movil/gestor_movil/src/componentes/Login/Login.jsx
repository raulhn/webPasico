import {
  EntradaTexto,
  Boton,
  ModalAviso,
} from "../ComponentesUI/ComponentesUI";
import "./Login.css";
import { useState, useContext, useEffect } from "react";
import { useUsuario } from "../../hooks/useUsuario";
import { UsuarioContext } from "../../contexto/UsuarioContext";
import { useNavigate } from "react-router-dom";
import { URL_SUBPATH } from "../../config/Constantes";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { realizarLogin } = useUsuario();

  const navigate = useNavigate();

  const {
    actualizarUsuario,
    usuario: usuarioSesion,
    actualizarRoles,
  } = useContext(UsuarioContext);

  function actualizarLogin(usuario_, roles_) {
    if (usuario_ && roles_) {
      actualizarUsuario(usuario_);
      actualizarRoles(roles_);
    } else {
      setModalVisible(true);
    }
  }

  useEffect(() => {
    if (usuarioSesion) {
      navigate(URL_SUBPATH + "/"); // Redirige a la raíz si ya hay usuario en sesión
    }
  }, [usuarioSesion, navigate]);

  function handleSubmit(e) {
    try {
      e.preventDefault(); // Evita el recargo de la página
      // Aquí va la acción del botón, por ejemplo:
      realizarLogin(usuario, password, actualizarLogin);
    } catch (error) {
      console.log("Error en el login", error);
      setModalVisible(true);
    }
  }

  return (
    <div className="contenedor">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="contenedor">
          <div className="campo">
            <span>Correo electrónico:</span>
            <EntradaTexto
              setTexto={(texto) => {
                setUsuario(texto);
              }}
              width="300px"
            />
          </div>
          <div className="campo">
            <span>Contraseña:</span>
            <EntradaTexto
              secure={true}
              setTexto={(texto) => {
                setPassword(texto);
              }}
            />
          </div>
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              paddingTop: "10px",
            }}
          >
            <Boton texto="Iniciar sesión" type="submit" />
          </div>
        </div>
      </form>

      <div
        style={{
          justifyContent: "center",
          display: "flex",
          paddingTop: "10px",
        }}
      >
        <span> ¿No tienes cuenta?</span>
        <a href={URL_SUBPATH + "/registro"} style={{ marginLeft: "5px" }}>
          Regístrate aquí
        </a>
      </div>

      <div
        style={{
          justifyContent: "center",
          display: "flex",
          paddingTop: "10px",
        }}
      >
        <a
          href={URL_SUBPATH + "/recuperarPassword"}
          style={{ marginLeft: "5px" }}
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <ModalAviso
        visible={modalVisible}
        setVisible={() => setModalVisible(false)}
        titulo={"Error de login"}
        mensaje={
          "Usuario o contraseña incorrectos. Por favor, inténtelo de nuevo."
        }
        textBoton={"Aceptar"}
      ></ModalAviso>
    </div>
  );
}
