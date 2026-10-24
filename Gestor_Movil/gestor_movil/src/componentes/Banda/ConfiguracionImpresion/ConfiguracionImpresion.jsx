import { useConfiguracionImpresion } from "../../../hooks/useConfiguracionImpresion";
import { useState, useEffect } from "react";
import {
  EntradaTexto,
  Boton,
  ModalAviso,
  ModalExito,
} from "../../ComponentesUI/ComponentesUI.jsx";

export default function ConfiguracionImpresion() {
  const { configuracion, actualizarConfiguracion } =
    useConfiguracionImpresion();
  const [
    nid_configuracion_cuota_impresion,
    set_nid_configuracion_cuota_impresion,
  ] = useState();
  const [max_solicitudes_pendientes, set_max_solicitudes_pendientes] =
    useState();
  const [max_solicitudes_ventana, set_max_solicitudes_ventana] = useState();
  const [ventana_dias, set_ventana_dias] = useState();
  const [max_archivos_set_por_solicitud, max_archivos_por_solicitud] =
    useState();
  const [max_paginas, set_max_paginas] = useState();

  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    if (configuracion) {
      set_max_solicitudes_pendientes(configuracion.max_solicitudes_pendientes);
      set_max_solicitudes_ventana(configuracion.max_solicitudes_ventana);
      set_ventana_dias(configuracion.ventana_dias);
      max_archivos_por_solicitud(configuracion.max_archivos_set_por_solicitud);
      set_max_paginas(configuracion.max_paginas);
      set_nid_configuracion_cuota_impresion(
        configuracion.nid_configuracion_cuota_impresion,
      );
    }
  }, [configuracion]);

  async function peticionActualizarConficuarcion() {
    try {
      const respuetsa = await actualizarConfiguracion({
        nid_configuracion_cuota_impresion,
        max_solicitudes_pendientes,
        max_solicitudes_ventana,
        ventana_dias,
        max_archivos_set_por_solicitud,
        max_paginas,
      });

      console.log("Configuración actualizada:", respuetsa);
      setExito("Configuración actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la configuración:", error);
      setError("Error al actualizar la configuración");
    }
  }

  return (
    <div>
      <h1>Configuración de Impresión</h1>
      {/* Aquí puedes agregar los elementos de configuración de impresión */}
      <EntradaTexto
        label="Máximo de solicitudes pendientes"
        value={max_solicitudes_pendientes}
        onChange={(e) => set_max_solicitudes_pendientes(e.target.value)}
      />
      <EntradaTexto
        label="Máximo de solicitudes por ventana"
        value={max_solicitudes_ventana}
        onChange={(e) => set_max_solicitudes_ventana(e.target.value)}
      />
      <EntradaTexto
        label="Ventana en días"
        value={ventana_dias}
        onChange={(e) => set_ventana_dias(e.target.value)}
      />
      <EntradaTexto
        label="Máximo de archivos por solicitud"
        value={max_archivos_set_por_solicitud}
        onChange={(e) => max_archivos_por_solicitud(e.target.value)}
      />
      <EntradaTexto
        label="Máximo de páginas"
        value={max_paginas}
        onChange={(e) => set_max_paginas(e.target.value)}
      />
      <Boton
        texto="Guardar Configuración"
        onClick={() => {
          // Aquí puedes agregar la lógica para guardar la configuración
          console.log("Configuración guardada");
          peticionActualizarConficuarcion();
        }}
      />

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
    </div>
  );
}
