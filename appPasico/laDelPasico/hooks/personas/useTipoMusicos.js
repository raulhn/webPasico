import ServiceTipoMusico from "../../servicios/serviceTipoMusico";
import { useState, useEffect } from "react";

export const useTiposMusicos = () => {
  const [tiposMusicos, setTiposMusicos] = useState([]);

  useEffect(() => {
    ServiceTipoMusico.obtenerTiposMusico()
      .then((respuesta) => {
        if (respuesta.error) {
          console.error(
            "Error al obtener los tipos de músico:",
            respuesta.error
          );
        } else {
          setTiposMusicos(respuesta.tipos_musico);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de músico:", error);
      });
  }, []);

  return { tiposMusicos };
};
