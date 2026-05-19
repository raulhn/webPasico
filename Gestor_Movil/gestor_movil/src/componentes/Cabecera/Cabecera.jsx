import { useContext, useEffect } from "react";
import { UsuarioContext } from "../../contexto/UsuarioContext";
import { Boton } from "../ComponentesUI/ComponentesUI";
import { useUsuario } from "../../hooks/useUsuario";
import { useNavigate, Link } from "react-router-dom";
import { URL_SUBPATH } from "../../config/Constantes";

import "./Cabecera.css";

export default function Cabecera() {
  const { usuario, actualizarUsuario, actualizarRoles, comprobarRoles } =
    useContext(UsuarioContext);
  const {
    logout,
    refrescarUsuario,
    roles: rolesRecuperados,
    usuario: usuarioRecuperado,
  } = useUsuario();
  const navigate = useNavigate();

  useEffect(() => {
    refrescarUsuario().then(() => {
      if (!usuario) {
        navigate(URL_SUBPATH + "/login");
      }
    });
  }, []);

  useEffect(() => {
    actualizarUsuario(usuarioRecuperado);
    actualizarRoles(rolesRecuperados);
  }, [usuarioRecuperado, rolesRecuperados]);

  async function manejarLogout() {
    await logout();
    actualizarUsuario(null);
    actualizarRoles([]);
    navigate(URL_SUBPATH + "/login");
  }

  return (
    <header className="cabecera-nav">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          paddingLeft: "2rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
          Banda del Pasico
        </h1>
        <nav>
          <ul
            style={{
              display: "flex",
              gap: "1.5rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            <li>
              <Link
                to={URL_SUBPATH + "/"}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Inicio
              </Link>
            </li>
            {comprobarRoles(["PROFESOR"]) && (
              <li>
                <Link
                  to={URL_SUBPATH + "/evaluaciones"}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Evaluaciones
                </Link>
              </li>
            )}
            {comprobarRoles(["ADMINISTRADOR", "COMISION_EDUCATIVA"]) && (
              <li>
                <Link
                  to={URL_SUBPATH + "/selector_evaluacion_profesor"}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Evaluaciones Profesor
                </Link>
              </li>
            )}
            <li>
              <Link
                to={URL_SUBPATH + "/cambiar_password"}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Cambiar Contraseña
              </Link>
            </li>
            {comprobarRoles(["ADMINISTRADOR", "MUSICO"]) && (
              <li>
                <Link
                  to={URL_SUBPATH + "/partituras"}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Partituras
                </Link>
              </li>
            )}
            {comprobarRoles(["ADMINISTRADOR"]) && (
              <li>
                <Link
                  to={URL_SUBPATH + "/lista_personas"}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Personas
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          paddingRight: "1rem",
        }}
      >
        {usuario && (
          <span style={{ fontWeight: 500 }}>Bienvenido, {usuario.nombre}</span>
        )}
        {usuario && <Boton texto={"Cerrar sesión"} onClick={manejarLogout} />}
        {!usuario && (
          <Boton
            texto={"Login"}
            onClick={() => {
              navigate(URL_SUBPATH + "/login");
            }}
          />
        )}
      </div>
    </header>
  );
}
