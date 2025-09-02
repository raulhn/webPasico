import { useContext } from "react";
import { UsuarioContext } from "../../contexto/UsuarioContext";
import { Boton } from "../ComponentesUI/ComponentesUI";
import { useUsuario } from "../../hooks/useUsuario";
import { useAsignaturasProfesor } from "../../hooks/useAsignaturas";
import { useNavigate } from "react-router";

export default function Cabecera()
{
    const {usuario, actualizarUsuario} = useContext(UsuarioContext);
    const {logout} = useUsuario();
    const navigate = useNavigate();

    async function manejarLogout() {
        await logout();
        actualizarUsuario(null);
    }

    const {asignaturas} = useAsignaturasProfesor();
    console.log("Asignaturas recuperadas:",asignaturas);

    console.log("Usuario en cabecera:", usuario);
    return (
        <header className="cabecera">
            <h1>Gestor Móvil</h1>
            {usuario && <p>Bienvenido, {usuario.nombre}</p>}
            {usuario && <Boton texto={"Cerrar sesión"} onClick={() => {manejarLogout();}}></Boton>}
            {!usuario && <Boton texto={"Login"} onClick={() => {navigate("/gestion/login");}}></Boton>}
        </header>
    )
}