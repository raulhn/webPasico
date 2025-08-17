import servicePersonas from "../../servicios/servicePersonas.js";
import { useState, useEffect } from "react";
import Constantes from "../../config/constantes.js";

export const usePersonas = (tipo = "", cerrar_sesion) => {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescar, setRefrescar] = useState(false);
  const [error, setError] = useState(false);

  function refrescarPersonas() {
    setRefrescar(true);
  }

  useEffect(() => {
    if (tipo === Constantes.BANDA) {
      servicePersonas
        .obtenerPersonasMusicos(cerrar_sesion)
        .then((personasRecuperadas) => {
          setPersonas(personasRecuperadas);
          setCargando(false); // Finaliza la carga
          setRefrescar(false);
          setError(false);
        })
        .catch((error) => {
          console.log("Error al obtener las personas músicos:", error);
          setPersonas([]);
          setCargando(false); // Finaliza la carga incluso si hay error
          setError(true);
          setRefrescar(false);
        });
    } else if (tipo === Constantes.ESCUELA) {
      servicePersonas
        .obtenerPersonasAlumnos(cerrar_sesion)
        .then((personasRecuperadas) => {
          setPersonas(personasRecuperadas);
          setCargando(false); // Finaliza la carga
          setRefrescar(false);
          setError(false);
        })
        .catch((error) => {
          console.log("Error al obtener las personas alumnos:", error);
          setPersonas([]);
          setCargando(false); // Finaliza la carga incluso si hay error
          setError(true);
          setRefrescar(false);
        });
    } else if (tipo === Constantes.ASOCIACION) {
      servicePersonas
        .obtenerPersonasAsociacion(cerrar_sesion)
        .then((personasRecuperadas) => {
          setPersonas(personasRecuperadas);
          setCargando(false); // Finaliza la carga
          setRefrescar(false);
          setError(false);
        })
        .catch((error) => {
          console.log("Error al obtener las personas de la asociación:", error);
          setPersonas([]);
          setCargando(false); // Finaliza la carga incluso si hay error
          setError(true);
          setRefrescar(false);
        });
    } else {
      servicePersonas
        .obtenerPersonas(cerrar_sesion)
        .then((personasRecuperadas) => {
          setPersonas(personasRecuperadas);
          setCargando(false); // Finaliza la carga
          setRefrescar(false);
          setError(false);
        })
        .catch((error) => {
          console.log("Error al obtener las personas:", error);
          setPersonas([]);
          setCargando(false); // Finaliza la carga incluso si hay error
          setRefrescar(false);
          setError(true);
        });
    }
  }, [refrescar]);

  return { personas, cargando, refrescarPersonas, error };
};
