import { obtenerInfoPersona } from "../services/servicePersonas.js";
import { useState, useEffect } from "react";

export const usePersonas = (nidPersona) => {
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
