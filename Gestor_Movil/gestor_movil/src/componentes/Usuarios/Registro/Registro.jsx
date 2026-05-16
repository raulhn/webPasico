import React, { useState } from "react";
import {
  EntradaTexto,
  Boton,
  ModalAviso,
  ModalConfirmacion,
} from "../../ComponentesUI/ComponentesUI";
import "./Registro.css";
import Turnstile from "react-turnstile";
import { registrarUsuario } from "../../../services/ServiceUsuario.js";

export default function Registro() {
  const [usuario, setUsuario] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correoElectronico: "",
    password: "",
  });

  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [tokenTurnstile, setTokenTurnstile] = useState("");
  const { mensajeError, setMensajeError } = useState("");
  const { mensajeConfirmacion, setMensajeConfirmacion } = useState("");
  const [modalConfirmacionVisible, setModalConfirmacionVisible] =
    useState(false);

  const solicitudRegistro = async () => {
    try {
      if (usuario.password !== confirmarPassword) {
        setMensajeError("Las contraseñas no coinciden");
        setModalErrorVisible(true);
        return;
      }
      await registrarUsuario(usuario, tokenTurnstile);
      setMensajeConfirmacion(
        "Usuario registrado exitosamente, revise su correo para activar la cuenta.",
      );
      setModalConfirmacionVisible(true);
    } catch (error) {
      console.error("Error:", error);
      setMensajeError(
        "Error al registrar el usuario. Por favor, inténtalo de nuevo.",
      );
      setModalErrorVisible(true);
    }
  };

  return (
    <div className="contenedor">
      <h2>Registro</h2>
      <form>
        <Turnstile
          sitekey="0x4AAAAAAACVqj8X9ZgL2e"
          onVerify={(token) => {
            setTokenTurnstile(token);
            console.log("Token de verificación:", token);
          }}
          onExpire={() => {
            console.log("El token ha expirado");
          }}
          onError={(err) => {
            console.error("Error en Turnstile:", err);
          }}
        />
        <div className="contenedor">
          <div className="campo">
            <EntradaTexto
              label="Nombre"
              valorDefecto={usuario.nombre}
              setTexto={(nombre) => setUsuario({ ...usuario, nombre: nombre })}
            />
          </div>
          <div className="campo">
            <EntradaTexto
              label="Primer Apellido"
              valorDefecto={usuario.primer_apellido}
              setTexto={(primer_apellido) =>
                setUsuario({ ...usuario, primer_apellido: primer_apellido })
              }
            />
          </div>
          <div className="campo">
            <EntradaTexto
              label="Segundo Apellido"
              valorDefecto={usuario.segundo_apellido}
              setTexto={(segundo_apellido) =>
                setUsuario({ ...usuario, segundo_apellido: segundo_apellido })
              }
            />
          </div>
          <div className="campo">
            <EntradaTexto
              label="Correo Electrónico"
              valorDefecto={usuario.correoElectronico}
              setTexto={(correoElectronico) =>
                setUsuario({ ...usuario, correoElectronico: correoElectronico })
              }
            />
          </div>
          <div className="campo">
            <EntradaTexto
              label="Contraseña"
              type="password"
              valorDefecto={usuario.password}
              setTexto={(password) =>
                setUsuario({ ...usuario, password: password })
              }
            />
          </div>
          <div>
            <EntradaTexto
              label="Confirmar Contraseña"
              type="password"
              valorDefecto={confirmarPassword}
              setTexto={(confirmarPassword) =>
                setConfirmarPassword(confirmarPassword)
              }
            />
          </div>
          <div className="campo">
            <Boton texto="Registrar" onClick={solicitudRegistro}></Boton>
          </div>
        </div>
      </form>

      <ModalAviso
        visible={modalErrorVisible}
        onClose={() => setModalErrorVisible(false)}
        mensaje={mensajeError}
        textoBoton="Aceptar"
        titulo="Error de Registro"
      />
      <ModalConfirmacion
        visible={modalConfirmacionVisible}
        onClose={() => setModalConfirmacionVisible(false)}
        mensaje={mensajeConfirmacion}
        textoBoton="Aceptar"
        titulo="Registro Correcto"
      />
    </div>
  );
}
