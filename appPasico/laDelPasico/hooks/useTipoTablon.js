import ServiceTiposTablon from "../servicios/serviceTiposTablon.js";
import { useState, useEffect } from "react";

export const useTipoTablon = (cerrar_sesion) => {
  const [tiposTablon, setTiposTablon] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  function lanzarRefresco() {
    setRefrescar(true);
  }

  useEffect(() => {
    ServiceTiposTablon.obtenerTiposTablon(cerrar_sesion)
      .then((tiposTablonRecuperados) => {
        setTiposTablon(tiposTablonRecuperados.tipo_tablones);
        setCargando(false);
        setRefrescar(false);
        setError(false);
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de tablón:", error);
        setTiposTablon([]);
        setCargando(false);
        setRefrescar(false);
        setError(true);
      });
  }, [refrescar, cerrar_sesion]);

  return { tiposTablon, cargando, error, lanzarRefresco };
};
