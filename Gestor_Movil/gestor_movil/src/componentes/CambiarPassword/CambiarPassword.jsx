
  import { useState } from "react";
import { useUsuario } from "../../hooks/useUsuario";
import Cabecera from "../Cabecera/Cabecera";
import {Boton, ModalExito, ModalAviso, EntradaTexto} from "../ComponentesUI/ComponentesUI"


export default function CambiarPassword() {
    const { cambiarPassword } = useUsuario();
    const [passwordActual, setPasswordActual] = useState("");
    const [nuevoPassword, setNuevoPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [visibleExito, setVisibleExito] = useState(false);
    const [visibleError, setVisibleError] = useState(false);
    const [mensajeError, setMensajeError] = useState("");


    return (        <>
            <Cabecera />
            <div className="contenedor" style={{ paddingTop: "60px" }}>
                <h2>Cambiar Contraseña</h2>

                <label>Contraseña Actual</label>
                <EntradaTexto secure={true} valorDefecto={passwordActual} setTexto={setPasswordActual} width="200px" />

                <label>Nueva Contraseña</label>
                <EntradaTexto secure={true} valorDefecto={nuevoPassword} setTexto={setNuevoPassword} width="200px"/>

                <label>Confirmar Nueva Contraseña</label>
                <EntradaTexto secure={true} valorDefecto={confirmarPassword} setTexto={setConfirmarPassword} width="200px" />

                <Boton
                    texto={"Cambiar Contraseña"}
                    onClick={async () => {
                        if (nuevoPassword !== confirmarPassword) {
                            setMensajeError("Las contraseñas no coinciden");
                            setVisibleError(true);
                            return;
                        }
                        const exito = await cambiarPassword(passwordActual, nuevoPassword);
                        if (exito) {
                            setVisibleExito(true);
                            setPasswordActual("");
                            setNuevoPassword("");
                            setConfirmarPassword("");
                        } else {
                            setMensajeError("Error al cambiar la contraseña. Verifique su contraseña actual.");
                            setVisibleError(true);
                        }
                    }}
                />

                <ModalExito
                    visible={visibleExito}
                    setVisible={setVisibleExito}
                    mensaje={"Contraseña cambiada con éxito"}
                    textBoton={"Aceptar"}
                    titulo={"Éxito"}
                />

                <ModalAviso
                    visible={visibleError}
                    setVisible={setVisibleError}
                    mensaje={mensajeError}
                    textBoton={"Aceptar"}
                    titulo={"Error"}
                />
            </div>
        </>
    );

}
