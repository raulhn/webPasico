import {
  obtenerInfoPersona,
  obtenerListadoPersonas,
} from "../services/servicePersonas.js";
import { useState, useEffect } from "react";

export const usePersona = (nidPersona) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchPersonaInfo = async () => {
      if (!nidPersona) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await obtenerInfoPersona(nidPersona);
        if (!data.error) {
          const infoObjeto = {
            persona: data.persona,
            padre: data.padre,
            madre: data.madre,
          };
          console.log("Info obtenida:", infoObjeto);
          setInfo(infoObjeto);
          setLoading(false);
        } else {
          setError(data.error);
          setInfo(null);
          setLoading(false);
        }
      } catch (err) {
        setError(err);
        setInfo(null);
        setLoading(false);
      }
    };

    fetchPersonaInfo();
  }, [nidPersona, refrescar]);

  // Monitor cambios en personaInfo

  function refresh() {
    setRefrescar(!refrescar);
  }

  return { info, loading, error, refresh };
};

export const usePersonas = (tipo, activo) => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  const [tipoPersona, setTipoPersona] = useState(tipo);
  const [activoPersona, setActivoPersona] = useState(activo);

  useEffect(() => {
    const fetchPersonas = async () => {
      setLoading(true);
      setError(true);

      try {
        const data = await obtenerListadoPersonas(tipoPersona, activoPersona);
        if (!data.error) {
          setError(false);
          setPersonas(data);
          setLoading(false);
        } else {
          setError(true);
          setPersonas([]);
          setLoading(false);
        }
      } catch (err) {
        console.log("Error al obtener el listado de personas:", err);
        setError(true);
        setLoading(false);
        setPersonas([]);
      }
    };

    fetchPersonas();
  }, [tipoPersona, activoPersona, refrescar]);

  function refresh() {
    setRefrescar(!refrescar);
  }
  return {
    personas,
    loading,
    error,
    refresh,
    setTipoPersona,
    setActivoPersona,
  };
};
