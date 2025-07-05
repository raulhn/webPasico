import serviceMatriculaAsignatura from "../../servicios/serviceMatriculaAsignatura.js";
import { useState, useEffect } from "react";

export const useMatriculasAsignaturaPersona = (
  nid_matricula,
  cerrar_sesion
) => {
  const [matriculasAsignatura, setMatriculasAsignatura] = useState([]);
  const [matricula, setMatricula] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [refrescar, setRefrescar] = useState(false);
  const [error, setError] = useState(false);

  function refrescarMatriculas() {
    setRefrescar(true);
  }

  useEffect(() => {
    serviceMatriculaAsignatura
      .obtenerMatriculasAsignaturaPersona(nid_matricula, cerrar_sesion)
      .then((matriculasRecuperadas) => {
        setMatriculasAsignatura(matriculasRecuperadas.matriculas);
        setMatricula(matriculasRecuperadas.matricula);
        setCargando(false); // Finaliza la carga
        setRefrescar(false);
        setError(false);
      })
      .catch((error) => {
        console.error("Error al obtener las matrículas:", error);
        setMatriculasAsignatura([]);
        setCargando(false); // Finaliza la carga incluso si hay error
        setRefrescar(false);
        setError(true);
      });
  }, [refrescar]);

  return {
    matriculasAsignatura,
    cargando,
    refrescarMatriculas,
    error,
    refrescar,
    matricula,
  };
};
