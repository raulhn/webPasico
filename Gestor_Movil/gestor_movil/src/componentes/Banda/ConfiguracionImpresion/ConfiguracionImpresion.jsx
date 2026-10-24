import { useConfiguracionImpresion } from "../../../hooks/useConfiguracionImpresion";
import { useContext, useEffect, useState } from "react";
import {
  ModalAviso,
  ModalExito,
} from "../../ComponentesUI/ComponentesUI.jsx";
import Cabecera from "../../Cabecera/Cabecera.jsx";
import { UsuarioContext } from "../../../contexto/UsuarioContext.js";

export default function ConfiguracionImpresion() {
  const { comprobarRoles } = useContext(UsuarioContext);
  const esAdministrador = comprobarRoles(["ADMINISTRADOR"]);
  const { configuracion, loading, error: errorCarga, actualizarConfiguracion } =
    useConfiguracionImpresion(esAdministrador);
  const [valores, setValores] = useState({
    max_solicitudes_pendientes: "",
    max_solicitudes_ventana: "",
    ventana_dias: "",
    max_archivos_por_solicitud: "",
    escala_minima: "",
    escala_maxima: "",
    max_paginas: "",
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    if (configuracion) {
      setValores({
        max_solicitudes_pendientes:
          configuracion.max_solicitudes_pendientes,
        max_solicitudes_ventana: configuracion.max_solicitudes_ventana,
        ventana_dias: configuracion.ventana_dias,
        max_archivos_por_solicitud:
          configuracion.max_archivos_por_solicitud,
        escala_minima: configuracion.escala_minima,
        escala_maxima: configuracion.escala_maxima,
        max_paginas: configuracion.max_paginas,
      });
    }
  }, [configuracion]);

  function actualizarValor(evento) {
    const { name, value } = evento.target;
    setValores((valoresActuales) => ({
      ...valoresActuales,
      [name]: value,
    }));
  }

  async function guardarConfiguracion(evento) {
    evento.preventDefault();
    const configuracionActualizada = Object.fromEntries(
      Object.entries(valores).map(([campo, valor]) => [
        campo,
        Number(valor),
      ]),
    );

    if (
      Object.values(configuracionActualizada).some(
        (valor) => !Number.isInteger(valor) || valor <= 0,
      )
    ) {
      setError("Todos los valores deben ser números enteros positivos.");
      return;
    }

    if (
      configuracionActualizada.max_solicitudes_ventana <
      configuracionActualizada.max_solicitudes_pendientes
    ) {
      setError(
        "El máximo de solicitudes por ventana no puede ser menor que el máximo de solicitudes pendientes.",
      );
      return;
    }

    if (
      configuracionActualizada.escala_minima >
      configuracionActualizada.escala_maxima
    ) {
      setError("La escala mínima no puede ser mayor que la escala máxima.");
      return;
    }

    try {
      setGuardando(true);
      await actualizarConfiguracion(configuracionActualizada);
      setExito("Configuración actualizada correctamente.");
    } catch (errorActualizacion) {
      setError(
        errorActualizacion.message ||
          "No se ha podido actualizar la configuración.",
      );
    } finally {
      setGuardando(false);
    }
  }

  const campos = [
    ["max_solicitudes_pendientes", "Máximo de solicitudes pendientes"],
    ["max_solicitudes_ventana", "Máximo de solicitudes por ventana"],
    ["ventana_dias", "Ventana en días"],
    ["max_archivos_por_solicitud", "Máximo de archivos por solicitud"],
    ["escala_minima", "Escala mínima (%)"],
    ["escala_maxima", "Escala máxima (%)"],
    ["max_paginas", "Máximo de páginas por archivo"],
  ];

  return (
    <>
      <Cabecera />
      <main style={{ maxWidth: "640px", margin: "40px auto" }}>
        <h1>Configuración de impresión</h1>
        {!esAdministrador ? (
          <p>No tienes permisos para administrar la configuración de impresión.</p>
        ) : loading ? (
          <p>Cargando configuración...</p>
        ) : errorCarga ? (
          <p>No se ha podido cargar la configuración de impresión.</p>
        ) : (
          <form onSubmit={guardarConfiguracion}>
            {campos.map(([nombre, etiqueta]) => (
              <label
                key={nombre}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginBottom: "16px",
                }}
              >
                {etiqueta}
                <input
                  className="entrada-texto"
                  min="1"
                  name={nombre}
                  onChange={actualizarValor}
                  required
                  step="1"
                  type="number"
                  value={valores[nombre]}
                />
              </label>
            ))}
            <button className="boton" disabled={guardando} type="submit">
              {guardando ? "Guardando..." : "Guardar configuración"}
            </button>
          </form>
        )}
      </main>

      <ModalAviso
        visible={error !== null}
        setVisible={() => setError(null)}
        textBoton={"Aceptar"}
        titulo={"Configuración de Impresión"}
        mensaje={error}
      />
      <ModalExito
        visible={exito !== null}
        setVisible={() => setExito(null)}
        textBoton={"Aceptar"}
        titulo={"Configuración de Impresión"}
        mensaje={exito}
      />
    </>
  );
}
