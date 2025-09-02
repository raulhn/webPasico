import { useContext } from "react";
import { UsuarioContext } from "../../contexto/UsuarioContext";

export default function Cabecera()
{
    const {usuario} = useContext(UsuarioContext);

    console.log("Usuario en cabecera:", usuario);
    return (
        <header className="cabecera">
            <h1>Gestor Móvil</h1>
            {usuario && <p>Bienvenido, {usuario.nombre}</p>}
        </header>
    )
}