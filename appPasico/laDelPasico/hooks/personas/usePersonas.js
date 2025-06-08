import servicePersonas from "../../servicios/servicePersonas.js";
import { useState, useEffect } from "react";

export const usePersonas = (tipo = "", cerrar_sesion) => {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (tipo === "") {
      servicePersonas
        .obtenerPersonas(cerrar_sesion)
        .then((personasRecuperadas) => {
          setPersonas(personasRecuperadas);
          setCargando(false); // Finaliza la carga
        })
        .catch((error) => {
          console.error("Error al obtener las personas:", error);
          setPersonas([]);
          setCargando(false); // Finaliza la carga incluso si hay error
        });
    } else if (tipo === "MUSICOS") {
      servicePersonas
        .obtenerPersonasMusicos(cerrar_sesion)
        .then((personasRecuperadas) => {
          setPersonas(personasRecuperadas);
          setCargando(false); // Finaliza la carga
        })
        .catch((error) => {
          console.error("Error al obtener las personas músicos:", error);
          setPersonas([]);
          setCargando(false); // Finaliza la carga incluso si hay error
        });
    }
  }, []);

  return { personas, cargando };
};
