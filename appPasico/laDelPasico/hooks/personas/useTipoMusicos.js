import ServiceTipoMusico from "../../servicios/serviceTipoMusico";
import { useState, useEffect } from "react";

export const useTiposMusicos = () => {
  const [tiposMusicos, setTiposMusicos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  useEffect(() => {
    ServiceTipoMusico.obtenerTiposMusico()
      .then((respuesta) => {
        if (respuesta.error) {
          console.log("Error al obtener los tipos de músico:", respuesta.error);
          setError(true);
          setCargando(false);
          setRefrescar(true);
        } else {
          setTiposMusicos(respuesta.tipos_musico);
          setCargando(false);
          setRefrescar(false);
        }
      })
      .catch((error) => {
        console.log("Error al obtener los tipos de músico:", error);
        setError(true);
        setCargando(false);
        setRefrescar(true);
      });
  }, []);

  return { tiposMusicos, cargando, error, refrescar };
};
