import servicePersonas from "../../servicios/servicePersonas.js";
import { useState, useEffect } from "react";

export const usePersonas = (cerrar_sesion) => {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
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
  }, []);

  return { personas, cargando };
};
