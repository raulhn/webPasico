import {
  obtenerConfiguracionImpresion,
  actualizarConfiguracionImpresion,
} from "../services/serviceSolicitudImpresion";
import { useState, useEffect } from "react";

export const useConfiguracionImpresion = () => {
  const [configuracion, setConfiguracion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerConfiguracionImpresion()
      .then((response) => {
        setConfiguracion(response.configuracion || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  async function actualizarConfiguracion(datosConfiguracion) {
    try {
      const response =
        await actualizarConfiguracionImpresion(datosConfiguracion);
      setConfiguracion(response.configuracion || null);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    }
  }

  return { configuracion, loading, error, actualizarConfiguracion };
};
