import {
  EntradaTexto,
  Boton,
  ModalAviso,
  ModalExito,
} from "../../ComponentesUI/ComponentesUI.jsx";
import { useState } from "react";
import { recuperarPassword } from "../../../services/ServiceUsuario.js";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [visibleModalError, setVisibleModalError] = useState(false);
  const [visibleModalExito, setVisibleModalExito] = useState(false);

  async function solicitarRecuperarPassword() {
    try {
      const respuesta = await recuperarPassword(email);
      if (respuesta.error) {
        setVisibleModalError(true);
      } else {
        setVisibleModalExito(true);
      }
    } catch (error) {
      console.error("Error RecuperarPassword", error);
      setVisibleModalError(true);
    }
  }
  return (
    <div class="container">
      <label>Email</label>
      <EntradaTexto valorDefecto={email} setTexto={setEmail} width={"350px"} />

      <Boton texto="Envia" onClick={solicitarRecuperarPassword}></Boton>
      <ModalExito
        visible={visibleModalExito}
        setVisible={setVisibleModalExito}
        textBoton={"Aceptar"}
        mensaje={"Se ha enviado un correo con la nueva contraseña"}
      />
      <ModalAviso
        visible={visibleModalError}
        setVisible={setVisibleModalError}
        textBoton={"Aceptar"}
        mensaje={"Se ha producido un error al recuperar la contraseña"}
      />
    </div>
  );
}
