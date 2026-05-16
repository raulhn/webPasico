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
import { PUBLIC_KEY_TURNSTILE } from "../../../config/Constantes.js";

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
      // Comprobación contraseña
      if (usuario.password !== confirmarPassword) {
        setMensajeError("Las contraseñas no coinciden");
        setModalErrorVisible(true);
        return;
      }

      if (
        usuario.correoElectronico.trim() === "" ||
        usuario.password.trim() === "" ||
        usuario.nombre.trim() === "" ||
        usuario.primer_apellido.trim() === ""
      ) {
        setMensajeError("Por favor, complete todos los campos obligatorios");
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
          sitekey={PUBLIC_KEY_TURNSTILE}
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
          <label> Nombre </label>

          <div className="campo">
            <EntradaTexto
              width={"300px"}
              valorDefecto={usuario.nombre}
              setTexto={(nombre) => setUsuario({ ...usuario, nombre: nombre })}
            />
          </div>
          <label> Primer Apellido </label>
          <div className="campo">
            <EntradaTexto
              width={"300px"}
              valorDefecto={usuario.primer_apellido}
              setTexto={(primer_apellido) =>
                setUsuario({ ...usuario, primer_apellido: primer_apellido })
              }
            />
          </div>
          <label> Segundo Apellido </label>
          <div className="campo">
            <EntradaTexto
              width={"300px"}
              valorDefecto={usuario.segundo_apellido}
              setTexto={(segundo_apellido) =>
                setUsuario({ ...usuario, segundo_apellido: segundo_apellido })
              }
            />
          </div>
          <label> Correo Electrónico </label>
          <div className="campo">
            <EntradaTexto
              width={"500px"}
              valorDefecto={usuario.correoElectronico}
              setTexto={(correoElectronico) =>
                setUsuario({ ...usuario, correoElectronico: correoElectronico })
              }
            />
          </div>
          <label> Contraseña </label>
          <div className="campo">
            <EntradaTexto
              width={"300px"}
              secuere={true}
              valorDefecto={usuario.password}
              setTexto={(password) =>
                setUsuario({ ...usuario, password: password })
              }
            />
          </div>
          <label> Confirmar Contraseña </label>
          <div>
            <EntradaTexto
              secure={true}
              width={"300px"}
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
