import ServiceMatriculas from "../../servicios/serviceMatriculas.js";
import { useState, useEffect } from "react";

export const useMatriculas = (cerrar_sesion) => {
  const [matriculas, setMatriculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescar, setRefrescar] = useState(false);
  const [error, setError] = useState(false);

  function refrescarMatriculas() {
    setRefrescar(true);
  }

  useEffect(() => {
    ServiceMatriculas.obtenerMatriculasPersona(cerrar_sesion)
      .then((matriculasRecuperadas) => {
        const matriculasOrdenadas = matriculasRecuperadas.matriculas.sort(
          (a, b) => (a.nid_curso > b.nid_curso ? -1 : 1)
        );
        setMatriculas(matriculasOrdenadas);
        setCargando(false); // Finaliza la carga
        setRefrescar(false);
        setError(false);
      })
      .catch((error) => {
        console.error("Error al obtener las matrículas:", error);
        setMatriculas([]);
        setCargando(false); // Finaliza la carga incluso si hay error
        setRefrescar(false);
        setError(true);
      });
  }, [refrescar]);

  return { matriculas, cargando, refrescarMatriculas, error, refrescar };
};
